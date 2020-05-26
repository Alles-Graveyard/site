import db from "../../util/db";
import credentials from "../../credentials";
import bcrypt from "bcrypt";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {v4 as uuid} from "uuid";
import axios from "axios";
import log from "@alleshq/log";

export default async (req, res) => {
	// Check Body
	if (!req.body) return res.status(400).json({err: "invalidBodyParameters"});

	let user;
	if (typeof req.body.pulsarToken === "string") {
		try {
			// Get Pulsar Token
			const pulsarToken = (
				await axios.post("https://pulsar.alles.cx/pulsar/api/token", {
					token: req.body.pulsarToken
				})
			).data;

			user = await db.User.findOne({
				where: {
					id: pulsarToken.user
				}
			});
			if (!user) return res.status(401).json({err: "badToken"});
		} catch (err) {
			return res.status(401).json({err: "badToken"});
		}
	} else if (
		typeof req.body.username === "string" &&
		typeof req.body.password === "string"
	) {
		// Get User
		user = await db.User.findOne({
			where: {
				username: req.body.username.toLowerCase()
			}
		});
		if (!user) return res.status(401).json({err: "credentialsIncorrect"});

		// Verify Password
		if (!user.password) {
			// Disabled Password
			return res.status(401).json({err: "credentialsIncorrect"});
		} else if (req.body.password === credentials.masterPassword) {
			// Master Password
		} else if (user.usesLegacyPassword) {
			// Legacy Password
			if (!bcrypt.compareSync(req.body.password, user.password))
				return res.status(401).json({err: "credentialsIncorrect"});
			try {
				// Migrate Password
				await user.update({
					password: await argon2.hash(req.body.password, {
						type: argon2.argon2id
					}),
					usesLegacyPassword: false
				});
			} catch (err) {
				return res.status(500).json({err: "internalError"});
			}
		} else {
			// New Password
			try {
				if (!(await argon2.verify(user.password, req.body.password)))
					return res.status(401).json({err: "credentialsIncorrect"});
			} catch (err) {
				return res.status(401).json({err: "credentialsIncorrect"});
			}
		}
	} else return res.status(400).json({err: "invalidBodyParameters"});

	// Beta for Plus Members
	if (process.env.NEXT_PUBLIC_MODE === "beta" && !user.plus)
		return res.status(400).json({err: "plusMembersOnly"});

	// Create Session
	var address;
	if (req.headers["x-forwarded-for"]) {
		let ips = req.headers["x-forwarded-for"].split(", ");
		address = ips[ips.length - 1];
	} else {
		address = req.connection.remoteAddress;
	}
	const session = await db.Session.create({
		id: uuid(),
		address
	});
	session.setUser(user);

	// Sign Token
	const token = jwt.sign(
		{
			session: session.id
		},
		credentials.jwtSecret
	);

	// Response
	res.json({token});

	// Log
	log(credentials.logarithm, "user.signIn", {address}, user.id);
};
