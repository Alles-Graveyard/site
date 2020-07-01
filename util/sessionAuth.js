import db from "./db";
import jwt from "jsonwebtoken";
import {getUser} from "./nexus";
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
	let user;
	try {
		user = await getUser(session.userId);
	} catch (err) {
		return fail;
	}

	// Restrict Beta to Plus
	if (process.env.NEXT_PUBLIC_MODE === "beta" && !user.plus) return fail;

	// Return
	return {
		session,
		user
	};
};
