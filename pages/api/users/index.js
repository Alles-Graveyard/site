import db from "../../../util/db";
import config from "../../../config";
import sessionAuth from "../../../util/sessionAuth";
import {Op} from "sequelize";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});

	//Form Database Query
	var dbQuery = {
		private: false
	};
	var backwards = false;
	if (typeof req.query.after === "string") {
		dbQuery.username = {
			[Op.gt]: req.query.after
		};
	} else if (typeof req.query.before === "string") {
		dbQuery.username = {
			[Op.lt]: req.query.before
		};
		backwards = true;
	}

	//Get Users
	const users = await db.User.findAll({
		where: dbQuery,
		attributes: ["id", "username", "name", "plus"],
		order: [["username", backwards ? "DESC" : "ASC"]],
		limit: config.usersResultLimit
	});
	if (backwards) users.reverse();

	//Get IDs of first/last users (pagination)
	const first = await db.User.findOne({
		attributes: ["id"],
		order: [["username", "ASC"]]
	});
	const last = await db.User.findOne({
		attributes: ["id"],
		order: [["username", "DESC"]]
	});

	//Response
	res.json({
		users,
		firstPage: !first || users.map(u => u.id).includes(first.id),
		lastPage: !last || users.map(u => u.id).includes(last.id)
	});
};
