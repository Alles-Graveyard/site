import sessionAuth from "../../../util/sessionAuth";
import config from "../../../config";
import credentials from "../../../credentials";
import db from "../../../util/db";
import {v4 as uuid} from "uuid";
import axios from "axios";
import sharp from "sharp";
import FormData from "form-data";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});
	if (typeof req.body.content !== "string")
		return res.status(400).json({err: "badRequest"});

	const content = req.body.content.trim();
	if (content.length < 1 || content.length > config.maxPostLength)
		return res.status(400).json({err: "postLength"});

	// Get Content Score
	const score = (
		await axios.post(
			"https://content-score.alles.cx",
			{
				content
			},
			{
				headers: {
					authorization: credentials.contentScore
				}
			}
		)
	).data;

	// Image
	let imageId;
	if (typeof req.body.image === "string") {
		try {
			// Convert to Buffer
			let img = Buffer.from(req.body.image.split(";base64,")[1], "base64");

			// Resize
			img = await sharp(img)
				.resize({
					width: 500,
					fit: "cover"
				})
				.png()
				.toBuffer();

			// Create Text Overlay
			const {height} = await sharp(img).metadata();
			const text = Buffer.from(`
				<svg
					width="500"
					height="${height}"
				>
					<text
						font-family="Rubik, sans-serif"
						font-size="10"
						x="10"
						y="${height - 10}"
						fill="#ffffff"
					>@${user.username}</text>
				</svg>
			`);

			// Composite Overlay
			img = await sharp(img).composite([
				{
					input: text
				}
			]);

			// Convert to png
			img = await img.png().toBuffer();

			// Upload to AllesFS
			const formData = new FormData();
			formData.append("file", img, {
				filename: "image"
			});
			formData.append("public", "true");
			imageId = (
				await axios.post(config.fileUploadUrl, formData.getBuffer(), {
					auth: credentials.fileUpload,
					headers: formData.getHeaders()
				})
			).data;
		} catch (e) {}
	}

	// Create Post
	const post = await db.Post.create({
		id: uuid(),
		content,
		score,
		image: imageId
	});
	await post.setUser(user);

	res.json({
		id: post.id
	});
};
