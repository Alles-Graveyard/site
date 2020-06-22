import Page from "../../../components/Page";
import withAuth from "../../../util/withAuth";
import axios from "axios";
import {Box, Spacer, Input, Button} from "@reactants/ui";
import {loadStripe} from "@stripe/stripe-js";
import {
	CardElement,
	Elements,
	useStripe,
	useElements
} from "@stripe/react-stripe-js";
import {useState} from "react";
import Router from "next/router";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

const page = props => (
	<Page
		title="Billing"
		user={props.user}
		breadcrumbs={[
			{
				name: "Billing",
				href: "/billing"
			},
			{
				name: "Add Card"
			}
		]}
	>
		{props.secret ? (
			<Elements stripe={stripePromise}>
				<Form secret={props.secret} />
			</Elements>
		) : (
			<p>Please setup billing first.</p>
		)}
	</Page>
);

page.getInitialProps = async ctx => {
	try {
		return (
			await axios.get(`${process.env.NEXT_PUBLIC_APIURL}/billing/setupIntent`, {
				headers: {
					authorization: ctx.user.sessionToken
				}
			})
		).data;
	} catch (err) {
		return;
	}
};

export default withAuth(page);

const Form = ({secret}) => {
	const [loading, setLoading] = useState(false);
	const [errorMessage, setError] = useState();
	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);
		setError();

		const cardName = e.target.name.value.trim();
		if (!cardName) return setLoading(false);

		const {setupIntent, error} = await stripe.confirmCardSetup(secret, {
			payment_method: {
				card: elements.getElement(CardElement),
				billing_details: {
					name: cardName
				}
			}
		});

		if (error) {
			setError(error.message);
			setLoading(false);
		} else Router.push("/billing");
	};

	return (
		<Box as="form" onSubmit={handleSubmit}>
			<Box.Header>Add a Card</Box.Header>
			<Box.Content>
				<Input
					fluid
					label="Cardholder Name"
					name="name"
					placeholder="Jessica Adams"
				/>

				<Spacer y={2} />

				<CardElement />
			</Box.Content>
			<Box.Footer
				style={{
					overflow: "auto",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<span
					style={{
						color: "var(--danger)"
					}}
				>
					{errorMessage}
				</span>
				<Button loading={loading} primary small right>
					Save
				</Button>
			</Box.Footer>
		</Box>
	);
};
