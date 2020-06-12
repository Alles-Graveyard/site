import credentials from "../credentials";
import jwt from "jsonwebtoken";
import {v4 as uuid} from "uuid";
import db from "../util/db";

export default async (userId, address) => {
	const session = await db.Session.create({
		id: uuid(),
		address,
		userId
	});

	return jwt.sign(
		{
			session: session.id
		},
		credentials.jwtSecret
	);
};
