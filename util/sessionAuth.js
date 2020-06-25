import db from "../util/db";
import jwt from "jsonwebtoken";
const fail = {
	user: null,
	session: null
};

export default async authHeader => {
	// Parse Header
	if (typeof authHeader !== "string") return fail;
	var token;
	try {
		token = jwt.verify(authHeader, process.env.SESSION_JWT);
	} catch (err) {
		return fail;
	}

	// Get Session
	const session = await db.Session.findOne({
		where: {
			id: token.session
		}
	});
	if (!session) return fail;

	// Get User
	const user = await session.getUser();
	if (!user) return fail;

	// Restrict Beta to Plus
	if (process.env.NEXT_PUBLIC_MODE === "beta" && !user.plus) return fail;

	return {
		session,
		user
	};
};
