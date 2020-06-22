import config from "../../../config";
import sessionAuth from "../../../util/sessionAuth";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SK);

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});
	if (user.primaryId) return res.status(400).json({err: "primaryOnly"});

	if (!req.body || typeof req.body.email !== "string")
		return res.status(400).json({err: "badRequest"});

	const email = req.body.email.trim().toLowerCase();
	if (email.length > config.inputBounds.email.max || !validateEmail(email))
		return res.status(400).json({err: "email.invalid"});

	if (user.stripeCustomerId) {
		// Update Customer
		stripe.customers.update(user.stripeCustomerId, {email});
	} else {
		// Create Customer
		const customer = await stripe.customers.create({
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
