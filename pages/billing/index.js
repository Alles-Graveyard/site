import Page from "../../components/Page";
import withAuth from "../../util/withAuth";
import axios from "axios";
import {Box, Spacer, Input, Button} from "@reactants/ui";
import {useState} from "react";
import config from "../../config";
import Router from "next/router";

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
		const email = e.target.email.value.trim();
		if (loading || !email) return;
		setLoading(true);

		axios
			.post(
				`${process.env.NEXT_PUBLIC_APIURL}/billing/update`,
				{
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
						<Box.Header>Customer Portal</Box.Header>
						<Box.Content>
							<p
								style={{
									marginBottom: 50,
									textAlign: "center"
								}}
							>
								You can manage your payment methods and subscriptions in the
								customer portal.
							</p>
							<Button
								loading={loading}
								primary
								fluid
								onClick={() => {
									setLoading(true);
									axios
										.get(`${process.env.NEXT_PUBLIC_APIURL}/billing/portal`, {
											headers: {
												authorization: props.user.sessionToken
											}
										})
										.then(res => (location.href = res.data.url));
								}}
							>
								Go
							</Button>
						</Box.Content>
					</Box>

					<Spacer y={2} />

					<Box>
						<Box.Header>Alles+</Box.Header>
						<Box.Content>
							<p>
								<strong>Status:</strong>{" "}
								{props.user.plus ? "Active 😃" : "Inactive 😦"}
							</p>
							<p>
								Alles+ gives you a bunch of exclusive features across the Alles
								platform, and it helps to support the development of Alles!
							</p>
							<p>
								A standard Alles+ subscription only applies to your primary
								account, but for only a little more, you can get Alles+ Max,
								which gives Alles+ to your primary account, and all of your
								secondary accounts.
							</p>
							{props.user.plus ? (
								<p>
									To manage your Alles+ subscription, visit the Customer Portal.
								</p>
							) : (
								<GetPlus
									sessionToken={props.user.sessionToken}
									showBanner={showBanner}
								/>
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
						<span>
							We store your payment information securely in{" "}
							<a href="https://stripe.com" className="normal">
								Stripe
							</a>
							.
						</span>
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

const plans = {
	monthly: "Alles+ ($5/month)",
	yearly: "Alles+ ($50/year)",
	"monthly-max": "🔥 Alles+ Max ($8/month)",
	"yearly-max": "🔥 Alles+ Max ($80/year)"
};

const GetPlus = ({sessionToken, showBanner}) => {
	const [plan, setPlan] = useState();
	const [loading, setLoading] = useState(false);
	const [purchased, setPurchased] = useState(false);

	const PlanButton = ({id}) => (
		<Button fluid onClick={() => setPlan(id)}>
			{plans[id]}
		</Button>
	);

	const purchase = () => {
		setLoading(true);

		axios
			.post(
				`${process.env.NEXT_PUBLIC_APIURL}/billing/plus?plan=${plan}`,
				{},
				{
					headers: {
						authorization: sessionToken
					}
				}
			)
			.then(() => setPurchased(true))
			.catch(() => {
				setLoading(false);
				showBanner("Something went wrong while subscribing to Alles+");
			});
	};

	return purchased ? (
		<></>
	) : plan ? (
		<div>
			<p>
				Are you sure you want to subscribe to <strong>{plans[plan]}</strong>?
			</p>

			<Button primary fluid onClick={() => purchase()} loading={loading}>
				Let's do it!
			</Button>

			<Spacer y={0.5} />

			<Button secondary fluid onClick={() => setPlan()} loading={loading}>
				No, I don't want to support Alles
			</Button>

			<p className="footnote">
				You will be charged the specified price immediately. The subscription
				will automatically renew, but you can change plans or manage your
				subscription in the Customer Portal.
			</p>

			<style jsx>{`
				div {
					margin-top: 50px;
				}

				p {
					text-align: center;
				}

				.footnote {
					font-size: 12px;
					color: var(--accents-6);
				}
			`}</style>
		</div>
	) : (
		<div>
			<PlanButton id="monthly" />
			<PlanButton id="yearly" />
			<PlanButton id="monthly-max" />
			<PlanButton id="yearly-max" />

			<style jsx>{`
				div {
					margin-top: 50px;
					display: grid;
					grid-template-columns: calc(50% - 5px) calc(50% - 5px);
					grid-template-rows: 50% 50%;
					grid-gap: 10px;
				}

				.plan {
					padding: 10px;
				}
			`}</style>
		</div>
	);
};
