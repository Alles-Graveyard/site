import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import config from "../config";
import axios from "axios";
import WideLink from "../components/WideLink";

const teamsPage = props => {
	return (
		<Page title="Teams" header user={props.user}>
			<section>
				<h1>My Teams</h1>
				{props.teams.length > 0 ? (
					props.teams.map(t => (
						<WideLink href="/t/[team].js" as={`/t/${t.slug}`} key={t.id}>
							{t.name}
						</WideLink>
					))
				) : (
					<p>It seems you have no teams right now.</p>
				)}
			</section>

			<style jsx>{`
				section {
					background: white;
					max-width: 600px;
					margin: 20px auto;
					border-radius: 10px;
					padding: 20px;
					box-sizing: border-box;
				}
			`}</style>
		</Page>
	);
};

teamsPage.getInitialProps = async ctx => {
	return {
		teams: (
			await axios.get(`${config.apiUrl}/teams`, {
				headers: {
					authorization: ctx.user.sessionToken
				}
			})
		).data
	};
};

export default withAuth(teamsPage);
