import sessionAuth from "../../../util/sessionAuth";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SK);

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// No Customer ID
	if (!user.stripeCustomerId)
		return res.status(200).json({
			billingData: null
		});

	// Get data from Stripe
	const customer = await stripe.customers.retrieve(user.stripeCustomerId);
	const subscriptions = await stripe.subscriptions.list();

	// Response
	res.json({
		billingData: {
			email: customer.email,
			hasSubscription: subscriptions.data.length > 0
		}
	});
};
