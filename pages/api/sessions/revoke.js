import db from "../../../util/db";
import sessionAuth from "../../../util/sessionAuth";

export default async (req, res) => {
	const {user, session} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});
	if (typeof req.query.id !== "string")
		return res.status(400).json({err: "badRequest"});

	// Get Session
	const s = await db.Session.findOne({
		where: {
			id: req.query.id,
			userId: user.id
		}
	});
	if (!s) return res.status(400).json({err: "invalidSession"});

	// Remove Session
	await s.destroy();

	// Response
	res.json({});
};
