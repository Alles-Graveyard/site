import sessionAuth from "../../util/sessionAuth";
import {getMentions} from "../../util/nexus";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Response
	res.json({
		mentions: await getMentions(user.id)
	});
};
