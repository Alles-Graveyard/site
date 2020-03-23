import Page from "../../../layout/Page";
import withAuth from "../../../util/withAuth";
import theme from "../../../theme";
import config from "../../../config";
import axios from "axios";
import {withRouter} from "next/router";
import moment from "moment";
import {useState} from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import formatAu from "../../../util/formatAu";

const paymentPage = props => {
	if (props.toAccount) {
		const [account, setAccount] = useState(
			props.accounts.length > 0 ? props.accounts[0].id : null
		);
		const [amount, setAmount] = useState(
			props.amount ? props.amount : config.inputBounds.auTransactionAmount.min
		);
		const [formError, setFormError] = useState("");
		const [formBusy, setFormBusy] = useState(false);
		const [paymentComplete, setComplete] = useState(false);

		const formElemStyle = {
			width: 150,
			display: "block",
			margin: "10px auto"
		};

		return (
			<Page title="Pay Au" header user={props.user}>
				<section>
					<h1>
						Pay <span>{props.toAccount.id.substr(0, 8)}</span>
					</h1>
					<h2>{props.toAccount.id}</h2>

					{props.toAccount.hasAccess ? (
						<>
							<p className="hasAccess">
								You {props.toAccount.team ? "have access to" : "own"} this
								account.
							</p>
							<h4>{props.toAccount.name}</h4>
						</>
					) : (
						<></>
					)}

					<p className="date">
						Created at {moment(props.toAccount.createdAt).format("LL")}
					</p>

					{paymentComplete ? (
						<p>You have completed this transaction.</p>
					) : props.accounts.length > 0 ? (
						<>
							<select onChange={e => setAccount(e.target.value)}>
								{props.accounts.map(acc => (
									<option key={acc.id} value={acc.id}>
										{acc.name}
									</option>
								))}
							</select>
							<p>
								This account has a balance of{" "}
								<span>
									{formatAu(
										props.accounts[
											props.accounts.map(acc => acc.id).indexOf(account)
										].balance
									)}
								</span>{" "}
								Au.
							</p>

							<form
								onSubmit={e => {
									e.preventDefault();
									if (formBusy) return;

									if (
										isNaN(amount) ||
										Number(amount) <
											config.inputBounds.auTransactionAmount.min ||
										Number(amount) > config.inputBounds.auTransactionAmount.max
									)
										return setFormError("Amount is invalid");

									setFormError("");
									setFormBusy(true);
									axios
										.post(
											`${config.apiUrl}/au/pay/${props.toAccount.id}`,
											{
												amount: Number(amount),
												meta: props.meta,
												redirect: props.redirectUrl,
												from: account
											},
											{
												headers: {
													authorization: props.user.sessionToken
												}
											}
										)
										.then(res => {
											if (props.redirectUrl) {
												location.href = `${
													props.redirectUrl
												}?transactionId=${encodeURIComponent(res.data.id)}`;
											} else {
												setComplete(true);
											}
										})
										.catch(() => {
											setFormError("Something went wrong.");
											setFormBusy(false);
										});
								}}
							>
								{props.amount ? (
									<p>
										You are going to pay <span>{amount}au</span>.
									</p>
								) : (
									<>
										<h3>How many Au will you pay?</h3>
										<Input
											type="number"
											defaultValue={config.inputBounds.auTransactionAmount.min}
											min={config.inputBounds.auTransactionAmount.min}
											max={config.inputBounds.auTransactionAmount.max}
											onChange={e => setAmount(e.target.value)}
											style={formElemStyle}
										/>
									</>
								)}

								<Button style={formElemStyle} disabled={formBusy}>
									Pay
								</Button>
							</form>

							{formError ? (
								<p style={{color: theme.error}}>{formError}</p>
							) : (
								<></>
							)}
						</>
					) : (
						<p>You don't have any Au accounts</p>
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

					h4 {
						margin: 0;
						margin-bottom: 20px;
					}

					p.date {
						color: ${theme.grey4};
						font-size: 15px;
					}

					h3 {
						font-weight: 500;
						margin: 0;
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
	const {id, amount, meta, redirectUrl} = ctx.query;
	const {sessionToken} = ctx.user;

	try {
		const toAccount = (
			await axios.get(`${config.apiUrl}/au/account/${encodeURIComponent(id)}`, {
				headers: {
					authorization: sessionToken
				}
			})
		).data.account;

		const accounts = (
			await axios.get(`${config.apiUrl}/au/accounts`, {
				headers: {
					authorization: sessionToken
				}
			})
		).data.accounts;

		return {
			toAccount,
			accounts,
			amount:
				!isNaN(amount) &&
				Number(amount) >= config.inputBounds.auTransactionAmount.min &&
				Number(amount) <= config.inputBounds.auTransactionAmount.max
					? Number(amount)
					: null,
			meta,
			redirectUrl
		};
	} catch (err) {
		return {
			toAccount: null
		};
	}
};

export default withAuth(withRouter(paymentPage));
