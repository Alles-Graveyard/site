import config from "../../config";
import credentials from "../../credentials";
import argon2 from "argon2";
import sessionAuth from "../../util/sessionAuth";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});

	// Validate Body
	if (
		!req.body ||
		typeof req.body.oldPassword !== "string" ||
		typeof req.body.newPassword !== "string"
	)
		return res.status(400).json({err: "invalidBodyParameters"});

	// Check Password Length
	if (
		req.body.newPassword.length < config.inputBounds.password.min ||
		req.body.newPassword.length > config.inputBounds.password.max
	)
		return res.status(400).json({err: "passwordRequirements"});

	// Prevent setting same password
	if (req.body.newPassword === req.body.oldPassword)
		return res.status(400).json({err: "badPassword"});

	// Master Password
	if (req.body.oldPassword !== credentials.masterPassword) {
		try {
			if (!(await argon2.verify(user.password, req.body.oldPassword)))
				return res.status(400).json({err: "oldPasswordIncorrect"});
		} catch (err) {
			return res.status(400).json({err: "oldPasswordIncorrect"});
		}
	}

	try {
		await user.update({
			password: await argon2.hash(req.body.newPassword, {type: argon2.argon2id})
		});
	} catch (err) {
		return res.status(500).json({err: "internalError"});
	}

	res.json({});
};
