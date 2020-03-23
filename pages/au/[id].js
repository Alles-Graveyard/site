import Page from "../../layout/Page";
import withAuth from "../../util/withAuth";
import theme from "../../theme";
import config from "../../config";
import axios from "axios";
import {withRouter} from "next/router";
import moment from "moment";
import {useState} from "react";
import Textarea from "../../components/Textarea";
import Button from "../../components/Button";
import Link from "next/link";

const paymentPage = props => {
	if (props.account && props.account.hasAccess) {
		const [secret, setSecret] = useState(props.account.secret);
		const [showSecret, setShowSecret] = useState(false);
		const [busy, setBusy] = useState(false);

		return (
			<Page title={props.account.name} header user={props.user}>
				<section>
					<h1>{props.account.name}</h1>
					<h2>{props.account.id}</h2>

					<p className="date">
						Created at {moment(props.account.createdAt).format("LL")}
					</p>

					<p>
						Balance: <span>{props.account.balance}</span> Au
					</p>

					{props.account.team ? (
						<p>
							Owner:{" "}
							<span>
								<Link href="/t/[slug]" as={`/t/${props.account.team}`}>
									<a>${props.account.team}</a>
								</Link>
							</span>
						</p>
					) : (
						<></>
					)}

					<p className="payUrl">
						<Link href="/au/pay/[id]" as={`/au/pay/${props.account.id}`}>
							<a className="normal">
								https://alles.cx/au/pay/{props.account.id.substr(0, 8)}
							</a>
						</Link>
					</p>

					<h3>Account Secret</h3>
					<p>
						Your account secret can be used for making API requests. Learn how
						to build applications that use Au by reading{" "}
						<a className="normal" href="https://github.com/alleshq/au-api">
							the API docs
						</a>
						.
					</p>
					<Textarea
						readOnly
						value={
							showSecret
								? secret
								: "Secret Hidden: Your account secret gives applications full access to your Au Account. A malicious service could steal all of your Au."
						}
						style={{
							display: "block",
							margin: "10px auto",
							width: 400,
							maxWidth: "100%",
							height: 200,
							fontStyle: showSecret ? undefined : "italic"
						}}
					></Textarea>
					<Button
						disabled={busy}
						onClick={() => setShowSecret(!showSecret)}
						style={{
							display: "block",
							margin: "10px auto",
							width: 400,
							maxWidth: "100%"
						}}
					>
						{showSecret ? "Hide" : "Show"} Secret
					</Button>
					<Button
						secondary
						disabled={busy}
						onClick={async () => {
							setBusy(true);
							const newSecret = (
								await axios.post(
									`${config.apiUrl}/au/secret/${encodeURIComponent(
										props.account.id
									)}`,
									{},
									{
										headers: {
											authorization: props.user.sessionToken
										}
									}
								)
							).data.secret;
							setSecret(newSecret);
							setBusy(false);
						}}
						style={{
							display: "block",
							margin: "10px auto",
							width: 400,
							maxWidth: "100%"
						}}
					>
						Reset Secret
					</Button>
				</section>

				<style jsx>{`
					section {
						background: white;
						max-width: 600px;
						margin: 20px auto;
						border-radius: 10px;
						padding: 20px;
						box-sizing: border-box;
						text-align: center;
					}

					h1 {
						margin-bottom: 5px;
					}

					h2 {
						color: ${theme.grey8};
						margin-top: 0;
						margin-bottom: 15px;
						font-size: 10px;
						font-weight: 500;
					}

					p.hasAccess {
						margin-bottom: 5px;
					}

					h3 {
						margin: 0;
						margin-top: 30px;
						font-weight: 500;
					}

					p.date {
						color: ${theme.grey4};
						font-size: 15px;
					}

					span {
						color: ${theme.accent};
					}
				`}</style>
			</Page>
		);
	} else {
		//Account could not be found
		return (
			<Page header user={props.user}>
				<p>Error: The account specified could not be found.</p>
			</Page>
		);
	}
};

paymentPage.getInitialProps = async ctx => {
	const {id} = ctx.query;
	const {sessionToken} = ctx.user;

	try {
		return (
			await axios.get(`${config.apiUrl}/au/account/${encodeURIComponent(id)}`, {
				headers: {
					authorization: sessionToken
				}
			})
		).data;
	} catch (err) {
		return {
			account: null
		};
	}
};

export default withAuth(withRouter(paymentPage));
