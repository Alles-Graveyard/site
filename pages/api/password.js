import config from "../../config";
import argon2 from "argon2";
import sessionAuth from "../../util/sessionAuth";
import {validatePassword} from "../../util/nexus";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Validate Body
	if (
		!req.body ||
		typeof req.body.oldPassword !== "string" ||
		typeof req.body.newPassword !== "string"
	)
		return res.status(400).json({err: "badRequest"});

	// Check Password Length
	if (
		req.body.newPassword.length < config.inputBounds.password.min ||
		req.body.newPassword.length > config.inputBounds.password.max
	)
		return res.status(400).json({err: "user.password.requirements"});

	// Prevent setting same password
	if (req.body.newPassword === req.body.oldPassword)
		return res.status(400).json({err: "user.password.same"});

	// Check old password
	if (
		user.password &&
		req.body.oldPassword !== process.env.MASTER_PASSWORD &&
		!validatePassword(user.id, req.body.oldPassword)
	)
		return res.status(400).json({err: "user.password.incorrect"});

	try {
		await user.update({
			password: await argon2.hash(req.body.newPassword, {type: argon2.argon2id})
		});
	} catch (err) {
		return res.status(500).json({err: "internalError"});
	}

	res.json({});
};
