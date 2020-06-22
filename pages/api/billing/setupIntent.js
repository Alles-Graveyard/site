import sessionAuth from "../../../util/sessionAuth";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SK);

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});
	if (!user.stripeCustomerId)
		return res.status(400).json({err: "billing.unregistered"});

	// Create Setup Intent
	const setupIntent = await stripe.setupIntents.create({
		customer: user.stripeCustomerId
	});

	// Response
	res.json({
		secret: setupIntent.client_secret
	});
};
