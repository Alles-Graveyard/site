import Page from "../components/Page";
import withAuth from "../util/withAuth";
import axios from "axios";
import WideUser from "../components/WideUser";
import {Box} from "@reactants/ui";

const page = props => {
	const switchUser = id => {
		axios
			.post(
				`${process.env.NEXT_PUBLIC_APIURL}/accounts/switch/${id}`,
				{},
				{
					headers: {
						authorization: props.user.sessionToken
					}
				}
			)
			.then(() => location.reload());
	};

	return (
		<Page
			title="Accounts"
			user={props.user}
			breadcrumbs={[
				{
					name: "Accounts"
				}
			]}
		>
			<Box>
				<Box.Header>My Accounts</Box.Header>
				<Box.Content>
					<p>
						Sign in to a related account. We allow each person to have one
						primary account, then they can create other secondary accounts.
					</p>
					<h3>Primary Account</h3>
					<WideUser
						user={props.accounts.primary}
						onClick={() => switchUser(props.accounts.primary.id)}
						style={{
							cursor: "pointer"
						}}
					/>

					<h3>Secondary Accounts</h3>
					{props.accounts.secondaries.length > 0 ? (
						props.accounts.secondaries.map(u => (
							<WideUser
								user={u}
								key={u.id}
								onClick={() => switchUser(u.id)}
								style={{
									cursor: "pointer"
								}}
							/>
						))
					) : (
						<p>It seems you have no secondary accounts.</p>
					)}
				</Box.Content>
			</Box>

			<style jsx>{`
				h3 {
					margin-top: 50px;
				}
			`}</style>
		</Page>
	);
};

page.getInitialProps = async ctx => {
	return {
		accounts: (
			await axios.get(`${process.env.NEXT_PUBLIC_APIURL}/accounts`, {
				headers: {
					authorization: ctx.user.sessionToken
				}
			})
		).data
	};
};

export default withAuth(page);
