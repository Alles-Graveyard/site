import db from "../../../../util/db";
import sessionAuth from "../../../../util/sessionAuth";
import postData from "../../../../util/postData";

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

	// Get Posts
	const posts =
		typeof req.query.posts === "string"
			? await Promise.all(
					(
						await u.getPosts({
							where: {
								parentId: null
							},
							order: [["createdAt", "DESC"]],
							limit: 100
						})
					).map(p => postData(p, user.id))
			  )
			: [];

	// Response
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
		plus: u.plus,
		posts,
		color: "23529f"
	});
};
