import sessionAuth from "../../../util/sessionAuth";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SK);

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});
	if (!user.stripeCustomerId)
		return res.status(400).json({err: "billing.unregistered"});
	if (
		!["monthly", "yearly", "monthly-max", "yearly-max"].includes(req.query.plan)
	)
		return res.status(400).json({err: "billing.invalidPlan"});

	// Check for active subscription
	const subscriptions = await stripe.subscriptions.list({
		customer: user.stripeCustomerId
	});
	if (user.plus || subscriptions.data.length > 0)
		return res.status(400).json({err: "alreadySet"});

	// Create Subscription
	await stripe.subscriptions.create({
		customer: user.stripeCustomerId,
		items: [
			{
				price:
					process.env[
						`STRIPE_PLUS_${req.query.plan.toUpperCase().replace("-", "_")}`
					]
			}
		]
	});

	// Response
	res.json({});
};
