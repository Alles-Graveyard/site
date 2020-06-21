import Page from "../../components/Page";
import withAuth from "../../util/withAuth";
import axios from "axios";
import {Box, Spacer, Input, Button} from "@reactants/ui";
import Link from "next/link";
import {useState} from "react";
import config from "../../config";

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

	// Register Billing
	const registerBilling = e => {
		e.preventDefault();
		const fullname = e.target.name.value.trim();
		const email = e.target.email.value.trim();
		if (loading || !fullname || !email) return;
		setLoading(true);

		axios
			.post(
				`${process.env.NEXT_PUBLIC_APIURL}/billing/register`,
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
			.then(() => location.reload())
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
			) : (
				<Box as="form" onSubmit={registerBilling}>
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
		await axios.get(`${process.env.NEXT_PUBLIC_APIURL}/devOrgs`, {
			headers: {
				authorization: ctx.user.sessionToken
			}
		})
	).data;
};

export default withAuth(page);
