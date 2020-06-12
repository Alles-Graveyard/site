import Page from "../components/ColumnPage";
import {useState} from "react";
import Router from "next/router";
import withAuth from "../util/withAuth";
import Cookies from "js-cookie";
import config from "../config";
import axios from "axios";
import {Input, Button, Box, Spacer} from "@reactants/ui";
import Link from "next/link";

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

		return (
			<Page title="Join Alles!" width="375px">
				<h2 style={{textAlign: "center"}}>Join Alles!</h2>

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

						// Request
						setLoading(true);
						axios
							.post(`${process.env.NEXT_PUBLIC_APIURL}/register`, {
								fullname,
								nickname: nickname ? nickname : fullname,
								username,
								password
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
								if (err.response.data.err === "credentialsIncorrect") {
									setError(
										"Your username or password doesn't seem to be right :/"
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
						/>

						<Spacer y={0.5} />

						<Input.Password
							label="Password"
							name="password"
							placeholder="•••••••••••"
							fluid
							onChange={() => setError(false)}
						/>

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
						. By signing up, you're indicating that you agree to them :)
					</Box.Footer>
				</Box>

				<style jsx>{`
					h2 {
						text-align: center;
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
