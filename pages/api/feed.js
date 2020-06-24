import sessionAuth from "../../util/sessionAuth";
import postData from "../../util/postData";
import db from "../../util/db";
import {Op, literal} from "sequelize";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Get Posts
	const posts = (
		await Promise.all(
			(
				await db.Post.findAll({
					where: {
						[Op.or]: [
							{
								userId: {
									[Op.in]: literal(
										// Yeah, I know, this doesn't look very safe but I spent hours trying to
										// find a better solution. Sequelize doesn't seem to support replacements in
										// literals here, and user ids will always be UUIDs, so it's good enough :/
										`(select followingId from followerRelations where followerId = "${user.id}")`
									)
								}
							},
							{
								userId: user.id
							}
						],
						parentId: null,
						createdAt: {
							[Op.gt]: new Date().getTime() - 1000 * 60 * 60 * 24 * 2
						}
					},
					order: [["createdAt", "DESC"]],
					limit: 100
				})
			).map(p => postData(p, user.id))
		)
	).map(p => ({type: "post", ...p}));

	// Response
	res.json({
		feed: posts
	});
};
