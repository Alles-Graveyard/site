import sessionAuth from "../../util/sessionAuth";
import {literal} from "sequelize";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Query
	const query = {
		attributes: {
			include: [
				[
					literal(
						"(select count(*) from followerRelations as follow where follow.followingId = user.id)"
					),
					"followers"
				]
			]
		},
		order: [[literal("followers"), "desc"], "createdAt"],
		limit: 250
	};

	// Response
	res.json({
		followerCount: await user.countFollowers(),
		followingCount: await user.countFollowing(),
		followers: (await user.getFollowers(query)).map(u => ({
			id: u.id,
			username: u.username,
			name: u.name,
			plus: u.plus,
			followers: u.followers
		})),
		following: (await user.getFollowing(query)).map(u => ({
			id: u.id,
			username: u.username,
			name: u.name,
			plus: u.plus
		}))
	});
};
