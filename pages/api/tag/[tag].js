import db from "../../../util/db";
import config from "../../../config";
import sessionAuth from "../../../util/sessionAuth";
import postData from "../../../util/postData";
import {Op} from "sequelize";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});
	if (typeof req.query.tag !== "string")
		return res.status(400).json({err: "badRequest"});

	// Get Tag
	const tag = await db.Tag.findOne({
		where: {
			id: req.query.tag
		}
	});
	if (!tag) return res.status(400).json({err: "invalidTag"});

	// Posts
	const posts = await Promise.all(
		(
			await tag.getPosts({
				where: {
					createdAt: {
						[Op.gt]: new Date().getTime() - 1000 * 60 * 60 * 24 * 2
					}
				},
				order: [["createdAt", "DESC"]],
				limit: 100
			})
		).map(p => postData(p, user.id))
	);

	// Response
	res.json({
		name: tag.id,
		image: tag.image ? `https://fs.alles.cx/${tag.image}` : null,
		title: tag.title ? tag.title : `#${tag.id}`,
		description: tag.description,
		url: tag.url,
		posts
	});
};
