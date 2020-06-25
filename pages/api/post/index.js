import sessionAuth from "../../../util/sessionAuth";
import config from "../../../config";
import db from "../../../util/db";
import {literal} from "sequelize";
import {v4 as uuid} from "uuid";
import axios from "axios";
import sharp from "sharp";
import FormData from "form-data";
import parseContent from "../../../util/parseContent";
import log from "@alleshq/log";
import shortUuid from "short-uuid";
const uuidTranslator = shortUuid();

const api = async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});
	if (typeof req.body.content !== "string")
		return res.status(400).json({err: "badRequest"});

	const content = req.body.content.trim();
	if (content.length < 1 || content.length > config.inputBounds.post.max)
		return res.status(400).json({err: "post.content.length"});

	// Parent
	let parent;
	if (typeof req.body.parent === "string") {
		parent = await db.Post.findOne({
			where: {
				id: uuidTranslator.toUUID(req.body.parent)
			}
		});
		if (!parent) {
			return res.status(400).json({err: "post.invalidParent"});
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
						authorization: process.env.CONTENT_SCORE
					}
				}
			)
		).data;
	} catch (err) {}

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
					width: user.plus ? 1000 : 500,
					fit: "cover"
				})
				.png()
				.toBuffer();

			// Upload to AllesFS
			const formData = new FormData();
			formData.append("file", img, {
				filename: "image"
			});
			formData.append("public", "true");
			imageId = (
				await axios.post(config.fileUploadUrl, formData.getBuffer(), {
					auth: {
						username: process.env.ALLESFS_ID,
						password: process.env.ALLESFS_SECRET
					},
					headers: formData.getHeaders()
				})
			).data;
		} catch (err) {}
	}

	// Parse Content
	const segments = parseContent(content);
	const tags = [];
	const taggedUsers = [];
	await Promise.all(
		segments.map(async segment => {
			if (segment.type === "tag") {
				// Tag
				if (!tags.includes(segment.string)) tags.push(segment.string);
			} else if (segment.type === "username") {
				// Username
				const taggedUser = await db.User.findOne({
					where: {
						username: segment.string
					}
				});
				if (
					taggedUser &&
					!taggedUsers.map(t => t.id).includes(taggedUser.id) &&
					taggedUser.id !== user.id
				)
					taggedUsers.push(taggedUser);
			}
		})
	);

	// Inherit User Tags
	if (parent) {
		const parentUserTags = await parent.getMentions();
		parentUserTags.forEach(taggedUser => {
			if (
				!taggedUsers.map(t => t.id).includes(taggedUser.id) &&
				taggedUser.id !== user.id
			)
				taggedUsers.push(taggedUser);
		});

		const parentAuthor = await parent.getUser();
		if (
			parentAuthor &&
			!taggedUsers.map(t => t.id).includes(parentAuthor.id) &&
			parentAuthor.id !== user.id
		)
			taggedUsers.push(parentAuthor);
	}

	// Create Post
	const post = await db.Post.create({
		id: uuid(),
		content,
		score,
		image: imageId
	});
	await post.setUser(user);
	const slug = uuidTranslator.fromUUID(post.id);

	// User Tags
	await Promise.all(taggedUsers.map(u => post.addMention(u)));

	// Tags
	await Promise.all(
		tags.map(async t => {
			if (t.length <= config.inputBounds.tag.max) {
				// Get Tag
				let tag = await db.Tag.findOne({
					where: {
						id: t
					}
				});

				// If tag does not exist, create
				if (!tag) tag = await db.Tag.create({id: t});

				// Associate Tag
				await tag.addPost(post);
			}
		})
	);

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
		slug
	});

	// Log
	log(
		{
			id: process.env.LOGARITHM_ID,
			secret: process.env.LOGARITHM_SECRET
		},
		"post.new",
		{
			id: post.id,
			slug
		},
		user.id
	);
};

const conf = {
	api: {
		bodyParser: {
			sizeLimit: config.imageSize
		}
	}
};

export {api as default, conf as config};
