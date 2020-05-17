import sessionAuth from "../../../util/sessionAuth";
import config from "../../../config";
import credentials from "../../../credentials";
import db from "../../../util/db";
import {literal} from "sequelize";
import {v4 as uuid} from "uuid";
import axios from "axios";
import sharp from "sharp";
import FormData from "form-data";
import shortUuid from "short-uuid";
const uuidTranslator = shortUuid();

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});
	if (typeof req.body.content !== "string")
		return res.status(400).json({err: "badRequest"});

	const content = req.body.content.trim();
	if (content.length < 1 || content.length > config.maxPostLength)
		return res.status(400).json({err: "postLength"});

	// Parent
	let parent;
	if (typeof req.body.parent === "string") {
		parent = await db.Post.findOne({
			where: {
				id: uuidTranslator.toUUID(req.body.parent)
			}
		});
		if (!parent) {
			return res.status(400).json({err: "invalidParent"});
		}
	}

	// Get Content Score
	let score = 0;
	try {
		score = (
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
	} catch (e) {}

	// Update user reputation
	await user.update({
		reputation: literal(`reputation + ${score}`)
	});

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

			// Metadata
			const metadata = await sharp(img).metadata();
			if (metadata.size > 1000000)
				return res.status(400).json({err: "imageTooBig"});

			// Create Text Overlay
			const text = Buffer.from(`
				<svg
					width="${metadata.width}"
					height="${metadata.height}"
				>
					<text
						font-family="Rubik, sans-serif"
						font-size="10"
						x="10"
						y="${metadata.height - 10}"
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

	// Parent
	if (parent) await post.setParent(parent);

	// Upvote
	await db.PostInteraction.create({
		postId: post.id,
		userId: user.id,
		vote: "up"
	});

	// Response
	res.json({
		username: user.username,
		slug: uuidTranslator.fromUUID(post.id)
	});
};
