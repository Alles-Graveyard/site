import config from "../../../config";
import credentials from "../../../credentials";
import sessionAuth from "../../../util/sessionAuth";
import Stripe from "stripe";
const stripe = Stripe(credentials.stripe.secret);

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});
	if (user.primaryId) return res.status(400).json({err: "primaryOnly"});

	if (
		!req.body ||
		typeof req.body.name !== "string" ||
		typeof req.body.email !== "string"
	)
		return res.status(400).json({err: "badRequest"});

	const fullname = req.body.name.trim();
	const email = req.body.email.trim().toLowerCase();
	if (fullname.length < config.inputBounds.min)
		return res.status(400).json({err: "profile.name.tooShort"});
	if (fullname.length > config.inputBounds.max)
		return res.status(400).json({err: "profile.name.tooLong"});
	if (email.length > config.inputBounds.email.max || !validateEmail(email))
		return res.status(400).json({err: "email.invalid"});

	if (user.stripeCustomerId) {
		// Update Customer
		stripe.customers.update(user.stripeCustomerId, {
			name: fullname,
			email
		});
	} else {
		// Create Customer
		const customer = await stripe.customers.create({
			name: fullname,
			email,
			metadata: {
				userId: user.id
			}
		});

		// Update Database
		await user.update({
			stripeCustomerId: customer.id
		});
	}

	// Response
	res.json({});
};

const validateEmail = email =>
	/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	);
