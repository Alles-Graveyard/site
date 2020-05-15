import sessionAuth from "../../../util/sessionAuth";
import config from "../../../config";
import db from "../../../util/db";
import {v4 as uuid} from "uuid";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});
	if (typeof req.body.content !== "string")
		return res.status(400).json({err: "badRequest"});

	const content = req.body.content.trim();
	if (content.length < 1 || content.length > config.maxPostLength)
		return res.status(400).json({err: "postLength"});

	// Create Post
	const post = await db.Post.create({
		id: uuid(),
		content,
		score: 0
	});
	await post.setUser(user);

	res.json({
		id: post.id
	});
};
