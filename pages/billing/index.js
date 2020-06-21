import Page from "../../components/Page";
import withAuth from "../../util/withAuth";
import axios from "axios";
import {Box, Spacer, Input, Button} from "@reactants/ui";
import Link from "next/link";
import {useState} from "react";
import config from "../../config";

const cardColors = {
	"American Express": "#002663",
	Visa: "#1a1f71",
	Unknown: "var(--accents-5)"
};

const page = props => {
	const [loading, setLoading] = useState(false);
	const [banner, setBanner] = useState();

	// Show Banner
	const showBanner = message => {
		setBanner({
			message,
			update: new Date().getTime()
		});
	};

	// Update Billing
	const updateBilling = e => {
		e.preventDefault();
		const fullname = e.target.name.value.trim();
		const email = e.target.email.value.trim();
		if (loading || !fullname || !email) return;
		setLoading(true);

		axios
			.post(
				`${process.env.NEXT_PUBLIC_APIURL}/billing/update`,
				{
					name: fullname,
					email
				},
				{
					headers: {
						authorization: props.user.sessionToken
					}
				}
			)
			.then(() => {
				if (props.billingData) setLoading(false);
				else location.reload();
			})
			.catch(err => {
				if (err.response && err.response.data.err === "email.invalid")
					showBanner("That email isn't valid!");
				else showBanner("Something went wrong.");
				setLoading(false);
			});
	};

	return (
		<Page
			title="Billing"
			banner={banner}
			user={props.user}
			breadcrumbs={[
				{
					name: "Billing"
				}
			]}
		>
			{props.user.primary ? (
				<>
					<h1>
						Sorry, you'll need to be signed in to your primary account to manage
						billing.
					</h1>
					<Button
						primary
						style={{
							margin: "0 auto"
						}}
						onClick={() => Router.push("/accounts")}
					>
						Switch Accounts
					</Button>
				</>
			) : props.billingData ? (
				<>
					<Box as="form" onSubmit={updateBilling}>
						<Box.Header>Your Billing Info</Box.Header>
						<Box.Content>
							<Input
								fluid
								label="Full Name"
								name="name"
								maxLength={config.inputBounds.name.max}
								placeholder="Jessica Adams"
								initialValue={props.billingData.name}
							/>
							<Spacer />
							<Input
								fluid
								label="Billing Email"
								name="email"
								maxLength={config.inputBounds.email.max}
								placeholder="jessica@alles.cx"
								initialValue={props.billingData.email}
							/>
						</Box.Content>
						<Box.Footer
							style={{
								overflow: "auto",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center"
							}}
						>
							<span></span>
							<Button loading={loading} primary small right>
								Update
							</Button>
						</Box.Footer>
					</Box>

					<Spacer y={2} />

					<Box>
						<Box.Header>Cards</Box.Header>
						<Box.Content>
							{props.billingData.cards.length > 0 ? (
								props.billingData.cards.map(card => (
									<Card key={card.id} {...card} />
								))
							) : (
								<p>You don't have any cards.</p>
							)}
						</Box.Content>
					</Box>
				</>
			) : (
				<Box as="form" onSubmit={updateBilling}>
					<Box.Header>Set Up Billing</Box.Header>
					<Box.Content>
						<Input
							fluid
							label="Full Name"
							name="name"
							maxLength={config.inputBounds.name.max}
							placeholder="Jessica Adams"
							initialValue={props.user.name}
						/>
						<Spacer />
						<Input
							fluid
							label="Billing Email"
							name="email"
							maxLength={config.inputBounds.email.max}
							placeholder="jessica@alles.cx"
						/>
					</Box.Content>
					<Box.Footer
						style={{
							overflow: "auto",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center"
						}}
					>
						<span></span>
						<Button loading={loading} primary small right>
							Register
						</Button>
					</Box.Footer>
				</Box>
			)}

			<style jsx>{`
				h1 {
					font-size: 30px;
					text-align: center;
				}
			`}</style>
		</Page>
	);
};

page.getInitialProps = async ctx => {
	return (
		await axios.get(`${process.env.NEXT_PUBLIC_APIURL}/billing`, {
			headers: {
				authorization: ctx.user.sessionToken
			}
		})
	).data;
};

export default withAuth(page);

const Card = props => (
	<article>
		<div className="icon"></div>
		<p className="main">
			{props.brand} &bull;&bull;&bull;&bull; {props.lastDigits}
		</p>
		<p className="date">
			Expires{" "}
			{
				[
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec"
				][props.expMonth - 1]
			}{" "}
			{props.expYear}
		</p>

		<style jsx>{`
			article {
				display: flex;
				margin: 10px 0;
			}

			.icon {
				height: 1.5em;
				width: 2.5em;
				border-radius: 5px;
				margin-right: 10px;
				background: ${cardColors[props.brand]
					? cardColors[props.brand]
					: cardColors["Unknown"]};
			}

			p {
				margin: auto 0;
			}

			.main {
				flex-grow: 1;
			}

			.date {
				margin-left: 10px;
			}
		`}</style>
	</article>
);
