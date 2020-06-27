import sessionAuth from "../../util/sessionAuth";
import {Op} from "sequelize";

export default async (req, res) => {
	const {user, session} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Get primary
	const primary = await user.getPrimary();

	// Count notifications
	const twoDaysAgo = new Date().getTime() - 1000 * 60 * 60 * 24 * 2;
	const notifications = await user.countMentions({
		where: {
			createdAt: {
				[Op.gt]:
					user.newNotifications > twoDaysAgo ? user.newNotifications : twoDaysAgo
			}
		},
		order: [["createdAt", "DESC"]]
	});

	// Response
	res.json({
		id: user.id,
		username: user.username,
		name: user.name,
		nickname: user.nickname,
		about: user.about,
		private: user.private,
		plus: user.plus,
		rubies: user.rubies,
		createdAt: user.createdAt,
		primary: primary
			? {
					id: primary.id,
					username: primary.username,
					name: primary.name
			  }
			: null,
		hasPassword: user.password !== null,
		session: session.id,
		notifications: notifications > 100 ? 100 : notifications
	});
};
