import sessionAuth from "../../util/sessionAuth";
import postData from "../../util/postData";
import {Op} from "sequelize";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Mark as read
	if (req.query.mark === "read") {
		await user.update({newNotifications: new Date()});
	}

	// Response
	res.json({
		mentions: await Promise.all(
			(
				await user.getMentions({
					where: {
						createdAt: {
							[Op.gt]: new Date().getTime() - 1000 * 60 * 60 * 24 * 2
						}
					},
					order: [["createdAt", "DESC"]],
					limit: 100
				})
			).map(p => postData(p, user.id))
		)
	});
};
