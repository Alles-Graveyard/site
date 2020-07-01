import axios from "axios";
import log from "@alleshq/log";
import getAddress from "../../util/getAddress";
import {
	getUser,
	getUserId,
	validatePassword,
	createSession
} from "../../util/nexus";

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

			// Get User
			user = await getUser(pulsarToken.user);
		} catch (err) {
			return res.status(400).json({err: "pulsar.badToken"});
		}
	} else if (
		typeof req.body.username === "string" &&
		typeof req.body.password === "string"
	) {
		// Get User
		try {
			user = await getUser(await getUserId(req.body.username.toLowerCase()));
		} catch (err) {
			return res.status(400).json({err: "user.signIn.credentials"});
		}

		// Verify Password
		if (
			!user.hasPassword ||
			!(await validatePassword(user.id, req.body.password))
		)
			return res.status(400).json({err: "user.signIn.credentials"});
	} else return res.status(400).json({err: "badRequest"});

	// Beta for Plus Members
	if (process.env.NEXT_PUBLIC_MODE === "beta" && !user.plus)
		return res.status(400).json({err: "plusOnly"});

	// Get Address
	const address = getAddress(req);

	// Create Session
	const session = await createSession(user.id, address);

	// Response
	res.json({token: session});

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
