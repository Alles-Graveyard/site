import sessionAuth from "../../util/sessionAuth";
import config from "../../config";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Response
	res.json({
		followerCount: await user.countFollowers(),
		followingCount: await user.countFollowing(),
		followers: (
			await user.getFollowers({
				order: [["rubies", "desc"], "createdAt"],
				limit: config.maxFollows
			})
		).map(u => ({
			id: u.id,
			username: u.username,
			name: u.name,
			plus: u.plus
		})),
		following: (
			await user.getFollowing({
				order: [["rubies", "desc"], "createdAt"],
				limit: config.maxFollows
			})
		).map(u => ({
			id: u.id,
			username: u.username,
			name: u.name,
			plus: u.plus
		}))
	});
};
