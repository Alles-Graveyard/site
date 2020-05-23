import db from "../../../../util/db";
import sessionAuth from "../../../../util/sessionAuth";
import credentials from "../../../../credentials";
import log from "@alleshq/log";
import shortUuid from "short-uuid";
const uuidTranslator = shortUuid();

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});
	if (typeof req.query.slug !== "string")
		return res.status(400).json({err: "badRequest"});

	// Post ID
	let id;
	try {
		id = uuidTranslator.toUUID(req.query.slug);
	} catch (err) {
		return res.status(400).json({err: "invalidPost"});
	}

	// Get Post
	const post = await db.Post.findOne({
		where: {
			id
		}
	});
	if (!post) return res.status(400).json({err: "invalidPost"});
	if (post.userId !== user.id)
		return res.status(400).json({err: "notYourPost"});

	// Remove Post
	await post.destroy();

	// Response
	res.json({});

	// Log
	log(
		credentials.logarithm,
		"post.delete",
		{
			id,
			slug: req.query.slug
		},
		user.id
	);
};
