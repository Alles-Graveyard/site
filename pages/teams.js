import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import config from "../config";
import theme from "../theme";
import axios from "axios";
import Link from "next/link";

const teamsPage = props => {
	return (
		<Page title="Teams" header user={props.user}>

			<section>
                <h1>Your Teams</h1>
                {props.teams.map(t => (
                    <Link href="/t/[team].js" as={`/t/${t.teamid}`} map={t.id}>
                        <a className="mainLink">{t.name}</a>
                    </Link>
                ))}
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

				a.mainLink {
					display: block;
					padding: 10px;
					border: 1px;
					cursor: pointer;
					color: black;
					text-decoration: none;
					border: 1px transparent;
					border-style: solid none;
					margin: 0;
					transition: 0.1s;
				}

				a.mainLink:hover {
					border-color: ${theme.borderGrey};
					color: ${theme.accent};
				}
			`}</style>
		</Page>
	);
};

teamsPage.getInitialProps = async ctx => {
    const res = await axios.get(`${config.apiUrl}/teams`, {
        headers: {
            authorization: ctx.user.sessionToken
        }
    });

    return {teams: res.data};
};

export default withAuth(teamsPage);