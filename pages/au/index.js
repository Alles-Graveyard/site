import Page from "../../layout/Page";
import withAuth from "../../util/withAuth";
import theme from "../../theme";
import moment from "moment";
import Link from "next/link";

const auPage = props => {
	return (
		<Page header user={props.user}>
			<main>
				<h1>Your Au Accounts</h1>

				{props.accounts.map(acc => (
					<section key={acc.id}>
						<h2>{acc.name}</h2>
						<h3 title={acc.id}>{acc.id.substr(0, 8)}</h3>
						<p>
							Balance: <span>{acc.balance}au</span>
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
				))}
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

auPage.getInitialProps = ctx => {
	return {
		accounts: [
			{
				id: "b05ef1c2-11f0-4970-9d5d-f890257e7304",
				name: "Archie's Personal Account",
				balance: 10000,
				createdAt: new Date(1584879798666)
			},
			{
				id: "8b989042-e146-4027-9703-f1b86dfaffe5",
				name: "Alles Vault",
				balance: 50000,
				team: "alles",
				createdAt: new Date(0)
			}
		]
	};
};

export default withAuth(auPage);
