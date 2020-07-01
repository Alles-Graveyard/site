import db from "../../util/db";
import axios from "axios";
import log from "@alleshq/log";
import createSession from "../../util/createSession";
import getAddress from "../../util/getAddress";
import {validatePassword} from "../../util/nexus";

export default async (req, res) => {
	// Check Body
	if (!req.body) return res.status(400).json({err: "badRequest"});

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
			if (!user) return res.status(400).json({err: "pulsar.badToken"});
		} catch (err) {
			return res.status(400).json({err: "pulsar.badToken"});
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
		if (!user) return res.status(400).json({err: "user.signIn.credentials"});

		// Verify Password
		if (!user.password || !(await validatePassword(user.id, req.body.password)))
			return res.status(400).json({err: "user.signIn.credentials"});
	} else return res.status(400).json({err: "badRequest"});

	// Beta for Plus Members
	if (process.env.NEXT_PUBLIC_MODE === "beta" && !user.plus)
		return res.status(400).json({err: "plusOnly"});

	// Get Address
	const address = getAddress(req);

	// Response
	res.json({
		token: await createSession(user.id, address)
	});

	// Log
	log(
		{
			id: process.env.LOGARITHM_ID,
			secret: process.env.LOGARITHM_SECRET
		},
		"user.signIn",
		{address},
		user.id
	);
};
