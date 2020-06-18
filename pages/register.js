import Page from "../components/ColumnPage";
import {useState, createRef, useEffect} from "react";
import Router from "next/router";
import withAuth from "../util/withAuth";
import Cookies from "js-cookie";
import config from "../config";
import axios from "axios";
import {Input, Button, Box, Spacer} from "@reactants/ui";
import Link from "next/link";
import Recaptcha from "react-google-recaptcha";

export default withAuth(props => {
	if (props.user) {
		return (
			<Page user={props.user} width="375px">
				<h2>Ummm, what?</h2>
				<p>
					You have an account, silly! We only allow one primary account per
					person, but we'll allow you to create secondary accounts soon...
				</p>

				<Spacer y={2} />

				<Button fluid primary onClick={() => Router.push("/")}>
					Return to Homepage
				</Button>
				<Spacer y={0.5} />
				<Button fluid secondary onClick={() => Router.push("/accounts")}>
					Switch Accounts
				</Button>

				<style jsx>{`
					h2,
					p {
						text-align: center;
					}
				`}</style>
			</Page>
		);
	} else {
		// Not Signed in
		const [error, setError] = useState();
		const [loading, setLoading] = useState(false);
		const [recaptchaToken, setRecaptchaToken] = useState();

		return (
			<Page title="Join Alles!" width="375px">
				<h2 style={{textAlign: "center"}}>Join Alles!</h2>

				{process.env.NEXT_PUBLIC_MODE === "beta" ? (
					<p
						style={{
							textAlign: "center"
						}}
					>
						You can't create an account on the beta site.
					</p>
				) : (
					<Box
						as="form"
						onSubmit={e => {
							e.preventDefault();
							setError();

							const fullname = e.target.name.value.trim();
							const nickname = fullname.split(" ")[0].trim();
							const username = e.target.username.value.trim();
							const password = e.target.password.value;
							if (!fullname || !username || !password) return;
							if (!recaptchaToken)
								return setError("You need to complete the captcha first!");

							// Request
							setLoading(true);
							axios
								.post(`${process.env.NEXT_PUBLIC_APIURL}/register`, {
									fullname,
									nickname: nickname ? nickname : fullname,
									username,
									password,
									recaptcha: recaptchaToken
								})
								.then(res => {
									Cookies.set("sessionToken", res.data.token, {
										domain:
											location.host === config.domain ? config.domain : null,
										expires: 365
									});
									Router.push("/");
								})
								.catch(err => {
									if (
										err.response.data.err === "profile.name.tooShort" ||
										err.response.data.err === "profile.name.tooLong"
									) {
										setError(
											`Your name must be between ${config.inputBounds.name.min} and ${config.inputBounds.name.max} characters`
										);
									} else if (
										err.response.data.err === "profile.username.tooShort" ||
										err.response.data.err === "profile.username.tooLong"
									) {
										setError(
											`Your username must be between ${config.inputBounds.username.min} and ${config.inputBounds.username.max} characters`
										);
									} else if (
										err.response.data.err === "user.password.requirements"
									) {
										setError(
											`Your password must be between ${config.inputBounds.password.min} and ${config.inputBounds.password.max} characters`
										);
									} else if (
										err.response.data.err === "profile.username.chars"
									) {
										setError(
											"Your username can only contain letters and numbers, sorry"
										);
									} else if (
										err.response.data.err === "profile.username.unavailable"
									) {
										setError("Sorry, this username is unavailable");
									} else if (err.response.data.err === "bot") {
										setError(
											"Something went wrong while checking that you're human. Try again."
										);
									} else {
										setError("Uh oh. Something's gone wrong. Maybe try again?");
									}
									setLoading(false);
								});
						}}
					>
						<Box.Header>Tell us a little about yourself</Box.Header>
						<Box.Content>
							<Input
								label="Name"
								name="name"
								placeholder="Jessica Adams"
								fluid
								onChange={() => setError(false)}
								maxLength={config.inputBounds.name.max}
							/>

							<Spacer y={0.5} />

							<Input
								label="Username"
								name="username"
								placeholder="jessica"
								fluid
								onChange={() => setError(false)}
								maxLength={config.inputBounds.username.max}
							/>

							<Spacer y={0.5} />

							<Input.Password
								label="Password"
								name="password"
								placeholder="•••••••••••"
								fluid
								onChange={() => setError(false)}
								maxLength={config.inputBounds.password.max}
							/>

							<Spacer y={1} />

							<div className="recaptcha">
								<Recaptcha
									sitekey="6LdTDqQZAAAAABVHA5tveWNheITaG9rnAbFzdxVH"
									onChange={token => setRecaptchaToken(token)}
									onErrored={() =>
										setError(
											"Something went wrong while checking that you're human. Refresh the page to try again."
										)
									}
									onExpired={() =>
										setError(
											"Something went wrong while checking that you're human. Refresh the page to try again."
										)
									}
								/>
							</div>

							<Spacer y={1} />

							<Button loading={loading} fluid primary>
								Register
							</Button>

							<Spacer y={0.5} />

							{error ? <p className="error">{error}</p> : <></>}
						</Box.Content>
						<Box.Footer>
							Psst! Make sure you take a look at our{" "}
							<Link href="/docs/terms">
								<a className="normal">Terms of Service</a>
							</Link>{" "}
							and{" "}
							<Link href="/docs/privacy">
								<a className="normal">Privacy Policy</a>
							</Link>
							. By signing up, you're indicating that you agree to them. Please
							note that you are only allowed{" "}
							<strong>one primary account per person</strong>, and violation of
							this rule could result in consequences to all of your accounts.
							You'll be able to create secondary accounts soon :)
						</Box.Footer>
					</Box>
				)}

				<style jsx>{`
					h2 {
						text-align: center;
					}

					.recaptcha {
						display: flex;
						justify-content: center;
					}

					.error {
						color: var(--danger);
						margin: 0;
					}
				`}</style>
			</Page>
		);
	}
}, true);
