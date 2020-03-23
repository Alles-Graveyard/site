import Page from "../../layout/Page";
import withAuth from "../../util/withAuth";
import theme from "../../theme";
import moment from "moment";
import Link from "next/link";
import axios from "axios";
import config from "../../config";
import formatAu from "../../util/formatAu";

const auPage = props => {
	return (
		<Page header user={props.user} title="Au Accounts">
			<main>
				<h1>Your Au Accounts</h1>

				{props.accounts.length > 0 ? (
					props.accounts.map(acc => (
						<section key={acc.id}>
							<h2>{acc.name}</h2>
							<h3 title={acc.id}>{acc.id.substr(0, 8)}</h3>
							<p>
								Balance: <span>{formatAu(acc.balance)}</span> Au
							</p>
							<p>Created at: {moment(acc.createdAt).format("LL")}</p>
							{acc.team ? (
								<p>
									Owner:{" "}
									<span>
										<Link href="/t/[slug]" as={`/t/${acc.team}`}>
											<a>${acc.team}</a>
										</Link>
									</span>
								</p>
							) : (
								<></>
							)}
						</section>
					))
				) : (
					<p>You have no Au accounts :(</p>
				)}
			</main>

			<style jsx>{`
				main {
					width: 800px;
					max-width: 100%;
					margin: 0 auto;
				}

				h1 {
					font-size: 35px;
				}

				section {
					background: #ffffff;
					box-sizing: border-box;
					padding: 20px;
					margin: 20px 0;
					position: relative;
				}

				h2 {
					margin: 10px 0;
					font-weight: 500;
				}

				h3 {
					margin: 0;
					font-weight: 400;
					font-size: 15px;
					color: ${theme.grey8};
					position: absolute;
					top: 10px;
					right: 10px;
				}

				span {
					color: ${theme.accent};
				}
			`}</style>
		</Page>
	);
};

auPage.getInitialProps = async ctx => {
	return (
		await axios.get(`${config.apiUrl}/au/accounts`, {
			headers: {
				authorization: ctx.user.sessionToken
			}
		})
	).data;
};

export default withAuth(auPage);
