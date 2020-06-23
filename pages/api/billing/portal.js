import sessionAuth from "../../../util/sessionAuth";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SK);

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});
	if (!user.stripeCustomerId)
		return res.status(400).json({err: "billing.unregistered"});

	// Create Portal Session
	const portalSession = await stripe.billingPortal.sessions.create({
		customer: user.stripeCustomerId
	});

	// Response
	res.json({
		url: portalSession.url
	});
};
