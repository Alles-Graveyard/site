import db from "../../../../util/db";
import sessionAuth from "../../../../util/sessionAuth";

export default async (req, res) => {
    const {user} = await sessionAuth(req.headers.authorization);
    if (!user) return res.status(401).json({err: "invalidSession"});

	//Get User
	const u = await db.User.findOne({
		where: {
			username: req.query.username
		}
	});
	if (!u) return res.status(400).json({err: "invalidUser"});

	//Response
	res.json({
		id: u.id,
		username: u.username,
		name: u.name,
		nickname: u.nickname,
		about: u.about,
		private: u.private,
		followers: await u.countFollowers(),
		isFollowing: await u.hasFollower(user),
		joinDate: u.createdAt,
		rubies: u.rubies,
		plus: u.plus
	});
};
