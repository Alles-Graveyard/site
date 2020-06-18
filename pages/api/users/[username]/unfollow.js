import db from "../../../../util/db";
import sessionAuth from "../../../../util/sessionAuth";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Get User
	if (typeof req.query.username !== "string")
		return res.status(400).json({err: "missingResource"});
	const u = await db.User.findOne({
		where: {
			username: req.query.username
		}
	});
	if (!u) return res.status(400).json({err: "missingResource"});

	// Not Followed
	if (!(await u.hasFollower(user))) return res.json({});

	// Remove Follower
	await u.removeFollower(user);

	res.json({});
};
