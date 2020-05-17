import db from "../../../../util/db";
import sessionAuth from "../../../../util/sessionAuth";
import shortUuid from "short-uuid";
const uuidTranslator = shortUuid();

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
	const posts = typeof req.query.posts === "string" ? (
		await u.getPosts({
			order: [["createdAt", "DESC"]],
			limit: 100
		})
	).map(p => ({
		slug: uuidTranslator.fromUUID(p.id),
		author: {
			id: u.id,
			name: u.name,
			username: u.username,
			plus: u.plus
		},
		content: p.content,
		image: p.image ? `https://fs.alles.cx/${p.image}` : null,
		createdAt: p.createdAt,
		score: 10,
		vote: 0,
		replies: 1
	})) : [];

	console.log(posts);
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
		posts
	});
};
