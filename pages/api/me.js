import sessionAuth from "../../util/sessionAuth";
import {countMentions} from "../../util/nexus";

export default async (req, res) => {
	const {user, session} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Response
	res.json({
		id: user.id,
		username: user.username,
		name: user.name,
		nickname: user.nickname,
		about: user.about,
		primary: null,
		plus: user.plus,
		rubies: user.rubies,
		createdAt: user.createdAt,
		hasPassword: user.hasPassword,
		session,
		notifications: await countMentions(user.id)
	});
};
