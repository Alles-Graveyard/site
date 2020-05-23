import sessionAuth from "../../util/sessionAuth";
import postData from "../../util/postData";
import db from "../../util/db";
import {Op} from "sequelize";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});

	// Get Followed Users
	const following = await user.getFollowing({
		attributes: ["id"]
	});

	// Get Posts
	const posts = (
		await Promise.all(
			(
				await db.Post.findAll({
					where: {
						userId: {
							[Op.in]: following.map(f => f.id)
						},
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
