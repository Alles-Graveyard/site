import config from "../../config";
import sessionAuth from "../../util/sessionAuth";
import log from "@alleshq/log";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	if (
		!req.body ||
		typeof req.body.name !== "string" ||
		typeof req.body.nickname !== "string" ||
		typeof req.body.about !== "string"
	)
		return res.status(400).json({err: "badRequest"});

	const fullname = req.body.name.trim();
	const nickname = req.body.nickname.trim();
	const about = req.body.about.trim();

	if (fullname.length < config.inputBounds.name.min)
		return res.status(400).json({err: "profile.name.tooShort"});
	if (fullname.length > config.inputBounds.name.max)
		return res.status(400).json({err: "profile.name.tooLong"});
	if (nickname.length < config.inputBounds.nickname.min)
		return res.status(400).json({err: "profile.nickname.tooShort"});
	if (nickname.length > config.inputBounds.nickname.max)
		return res.status(400).json({err: "profile.nickname.tooLong"});
	if (about.length < config.inputBounds.about.min)
		return res.status(400).json({err: "profile.about.tooShort"});
	if (about.length > config.inputBounds.about.max)
		return res.status(400).json({err: "profile.about.tooLong"});

	// Log
	if (user.name !== fullname) {
		log(
			{
				id: process.env.LOGARITHM_ID,
				secret: process.env.LOGARITHM_SECRET
			},
			"profile.name.update",
			{
				old: user.name,
				new: fullname
			},
			user.id
		);
	}

	if (user.nickname !== nickname) {
		log(
			{
				id: process.env.LOGARITHM_ID,
				secret: process.env.LOGARITHM_SECRET
			},
			"profile.nickname.update",
			{
				old: user.nickname,
				new: nickname
			},
			user.id
		);
	}

	// Update
	await user.update({
		name: fullname,
		nickname,
		about
	});

	// Response
	res.json({});
};
