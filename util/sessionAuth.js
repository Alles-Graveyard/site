import db from "../util/db";
import credentials from "../credentials";
import jwt from "jsonwebtoken";
const fail = {
	user: null,
	session: null
};

module.exports = async authHeader => {
	//Parse Header
	if (typeof authHeader !== "string") return fail;
	var token;
	try {
		token = jwt.verify(authHeader, credentials.jwtSecret);
	} catch (err) {
		return fail;
	}

	//Get Session
	const session = await db.Session.findOne({
		where: {
			id: token.session
		}
	});
	if (!session) return fail;

	return {
		session,
		user: await session.getUser()
	};
};