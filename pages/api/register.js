import db from "../../util/db";
import config from "../../config";
import credentials from "../../credentials";
import argon2 from "argon2";
import {v4 as uuid} from "uuid";
import axios from "axios";
import log from "@alleshq/log";
import createSession from "../../util/createSession";
import getAddress from "../../util/getAddress";

export default async (req, res) => {
	// Disable registrations on beta site
	if (process.env.NEXT_PUBLIC_MODE === "beta")
		return res.status(400).json({err: "beta"});

	// Check Body
	if (
		!req.body ||
		typeof req.body.fullname !== "string" ||
		typeof req.body.nickname !== "string" ||
		typeof req.body.username !== "string" ||
		typeof req.body.password !== "string" ||
		typeof req.body.recaptcha !== "string"
	)
		return res.status(400).json({err: "badRequest"});

	if (req.body.fullname.length < config.inputBounds.name.min)
		return res.status(400).json({err: "profile.name.tooShort"});
	if (req.body.fullname.length > config.inputBounds.name.max)
		return res.status(400).json({err: "profile.name.tooLong"});
	if (req.body.username.length < config.inputBounds.username.min)
		return res.status(400).json({err: "profile.username.tooShort"});
	if (req.body.username.length > config.inputBounds.username.max)
		return res.status(400).json({err: "profile.username.tooLong"});
	if (req.body.username.match(/[^a-zA-Z0-9]/))
		return res.status(400).json({err: "profile.username.chars"});
	if (
		req.body.password.length < config.inputBounds.password.min ||
		req.body.password.length > config.inputBounds.password.max
	)
		return res.status(400).json({err: "user.password.requirements"});

	// Verify Recaptcha
	try {
		const r = await axios.post(
			`https://www.google.com/recaptcha/api/siteverify?secret=${
				credentials.recaptchaSecret
			}&response=${encodeURIComponent(req.body.recaptcha)}`
		);
		if (!r.data.success) throw "Failed verification";
	} catch (e) {
		return res.status(400).json({err: "bot"});
	}

	// Check if user already exists
	const alreadyExists = await db.User.findOne({
		where: {
			username: req.body.username
		}
	});
	if (alreadyExists)
		return res.status(400).json({err: "profile.username.unavailable"});

	// Get Address
	const address = getAddress(req);

	// Create User
	const user = await db.User.create({
		id: uuid(),
		username: req.body.username.toLowerCase(),
		name: req.body.fullname,
		nickname: req.body.nickname,
		about: `Hi! I'm ${req.body.nickname}!`,
		password: await argon2.hash(req.body.password, {type: argon2.argon2id})
	});

	// Response
	res.json({
		token: await createSession(user.id, address)
	});

	// Log
	log(
		credentials.logarithm,
		"user.new",
		{
			address
		},
		user.id
	);
};
