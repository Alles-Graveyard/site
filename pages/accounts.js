import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import config from "../config";
import axios from "axios";
import WideUser from "../components/WideUser";

const page = props => {
	const switchUser = id => {
		axios
			.post(
				`${config.apiUrl}/accounts/switch/${id}`,
				{},
				{
					headers: {
						authorization: props.user.sessionToken
					}
				}
			)
			.then(() => {
				location.reload();
			});
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
			<section>
				<h1>My Accounts</h1>
				<p>
					Sign in to a related account. We allow each person to have one primary
					account, then they can create other secondary accounts.
				</p>
				<h3>Primary Account</h3>
				<WideUser
					user={props.accounts.primary ? props.accounts.primary : props.user}
					onClick={() =>
						switchUser(
							props.accounts.primary ? props.accounts.primary.id : props.user.id
						)
					}
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
			</section>

			<style jsx>{`
				section {
					background: white;
					width: 600px;
					max-width: 100%;
					margin: 20px auto;
					border-radius: 10px;
					padding: 20px;
					box-sizing: border-box;
				}

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
			await axios.get(`${config.apiUrl}/accounts`, {
				headers: {
					authorization: ctx.user.sessionToken
				}
			})
		).data
	};
};

export default withAuth(page);
