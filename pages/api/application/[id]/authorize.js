import db from "../../../../util/db";
import config from "../../../../config";
import {v4 as uuid} from "uuid";
import {generate as randomString} from "randomstring";
import sessionAuth from "../../../../util/sessionAuth";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});

	//Validate Body
	if (
		!req.body ||
		typeof req.body.scopes !== "string" ||
		typeof req.body.redirectUri !== "string"
	)
		return res.status(400).json({err: "invalidBodyParameters"});

	//Verify Scopes
	const scopes = [...new Set(req.body.scopes.split(" "))].filter(Boolean);
	if (scopes.length > 50) return res.status(400).json({err: "tooManyScopes"});
	for (var i = 0; i < scopes.length; i++) {
		if (scopes[i] && !config.validScopes.includes(scopes[i]))
			return res.status(400).json({err: "invalidScope"});
	}

	//Get Application
	if (typeof req.query.id !== "string")
		return res.status(400).json({err: "invalidApplication"});
	const application = await db.Application.findOne({
		where: {
			id: req.query.id
		}
	});
	if (!application) return res.status(400).json({err: "invalidApplication"});

	//Verify Redirect URI
	if (!application.callbackUrls.includes(req.body.redirectUri))
		return res.status(400).json({err: "invalidRedirectUri"});

	//Create code
	const code = await db.AuthCode.create({
		id: uuid(),
		code: randomString(128),
		redirectUri: req.body.redirectUri,
		scopes
	});
	code.setUser(user);
	code.setApplication(application);

	res.json({code: code.code});
};
