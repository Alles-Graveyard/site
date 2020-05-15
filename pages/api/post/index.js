import sessionAuth from "../../../util/sessionAuth";
import config from "../../../config";
import credentials from "../../../credentials";
import db from "../../../util/db";
import {v4 as uuid} from "uuid";
import axios from "axios";

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

	// Create Post
	const post = await db.Post.create({
		id: uuid(),
		content,
		score
	});
	await post.setUser(user);

	res.json({
		id: post.id
	});
};
