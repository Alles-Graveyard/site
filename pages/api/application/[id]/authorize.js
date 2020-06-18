import db from "../../../../util/db";
import config from "../../../../config";
import {v4 as uuid} from "uuid";
import {generate as randomString} from "randomstring";
import sessionAuth from "../../../../util/sessionAuth";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Validate Body
	if (
		!req.body ||
		typeof req.body.scopes !== "string" ||
		typeof req.body.redirectUri !== "string" ||
		typeof req.body.user !== "string"
	)
		return res.status(400).json({err: "badRequest"});

	// Verify Scopes
	const scopes = [...new Set(req.body.scopes.split(" "))].filter(Boolean);
	if (scopes.length > 50)
		return res.status(400).json({err: "application.scopes.tooMany"});
	for (var i = 0; i < scopes.length; i++) {
		if (scopes[i] && !config.validScopes.includes(scopes[i]))
			return res.status(400).json({err: "application.scopes.invalid"});
	}

	// Get Application
	if (typeof req.query.id !== "string")
		return res.status(400).json({err: "missingResource"});
	const application = await db.Application.findOne({
		where: {
			id: req.query.id
		}
	});
	if (!application) return res.status(400).json({err: "missingResource"});

	// Verify Redirect URI
	if (!application.callbackUrls.includes(req.body.redirectUri))
		return res.status(400).json({err: "application.badRedirect"});

	// Get Primary Account
	const primary = await user.getPrimary({
		attributes: ["id"]
	});

	// Get Secondary Accounts
	const secondaries = (
		await (primary ? primary : user).getSecondaries({
			attributes: ["id"]
		})
	).map(u => u.id);

	// Check ID is in connected accounts
	if (
		req.body.user !== (primary ? primary : user).id &&
		!secondaries.includes(req.body.user)
	)
		return res.status(400).json({err: "restrictedAccess"});

	// Create code
	const code = await db.AuthCode.create({
		id: uuid(),
		code: randomString(128),
		redirectUri: req.body.redirectUri,
		scopes,
		userId: req.body.user
	});
	code.setApplication(application);

	res.json({code: code.code});
};
