import {getUser, getSessionFromToken} from "./nexus";
const fail = {
	user: null,
	session: null
};

export default async authHeader => {
	// Parse Header
	if (typeof authHeader !== "string") return fail;

	// Get Session
	let session;
	try {
		session = await getSessionFromToken(authHeader);
	} catch (err) {
		return fail;
	}

	// Get User
	let user;
	try {
		user = await getUser(session.user);
	} catch (err) {
		return fail;
	}

	// Restrict Beta to Plus
	if (process.env.NEXT_PUBLIC_MODE === "beta" && !user.plus) return fail;

	// Return
	return {
		session: session.id,
		user
	};
};
