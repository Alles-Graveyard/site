import db from "../../../../util/db";
import sessionAuth from "../../../../util/sessionAuth";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});

	// Get User
	if (typeof req.query.username !== "string")
		return res.status(400).json({err: "invalidUser"});
	const u = await db.User.findOne({
		where: {
			username: req.query.username
		}
	});
	if (!u) return res.status(400).json({err: "invalidUser"});

	// Same User
	if (u.id === user.id) return res.status(400).json({err: "cannotFollowSelf"});

	// Already Followed
	if (await u.hasFollower(user)) return res.json({});

	// Add Follower
	await u.addFollower(user);

	res.json({});
};
