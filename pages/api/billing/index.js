import config from "../../../config";
import credentials from "../../../credentials";
import sessionAuth from "../../../util/sessionAuth";
import Stripe from "stripe";
const stripe = Stripe(credentials.stripe.secret);

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// No Customer ID
	if (!user.stripeCustomerId)
		return res.status(200).json({
			billingData: null
		});

	// Get Customer
	const customer = await stripe.customers.retrieve(user.stripeCustomerId);

	// Response
	res.json({
		billingData: {
			name: customer.name,
			email: customer.email,
			cards: customer.sources.data
				.filter(source => source.object === "card")
				.map(source => ({
					id: source.id,
					lastDigits: source.last4,
					brand: source.brand,
					expMonth: source.exp_month,
					expYear: source.exp_year
				}))
		}
	});
};
