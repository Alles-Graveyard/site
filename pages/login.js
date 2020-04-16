import Page from "../layout/CardPage";
import {useState} from "react";
import {withRouter} from "next/router";
import withAuth from "../reactants/withAuth";
import Cookies from "js-cookie";
import config from "../config";
import axios from "axios";
import theme from "../reactants/theme";

import Input from "../reactants/Input";
import Button from "../reactants/Button";
import SmallText from "../reactants/SmallText";
import Link from "next/link";

export default withAuth(
	withRouter(props => {
		if (props.user) {
			//No need to sign in again!
			return (
				<Page title="Sign in" logo user={props.user}>
					<h1 style={{textAlign: "center"}}>Already signed in</h1>
					<p>
						You're already signed in as{" "}
						<span style={{color: theme.accent}}>{props.user.name}</span>. You
						can{" "}
						<Link href="/accounts">
							<a className="normal">switch accounts</a>
						</Link>
						, or continue back to the redirect url.
					</p>
					<Button
						wide
						onClick={() => {
							const redirectUrl = props.router.query.redirect;
							window.location.href = redirectUrl ? redirectUrl : "/";
						}}
					>
						Continue
					</Button>

					<br />
					<br />
					<SmallText>
						Developer? This page puts the session token in a cookie that can be
						accessed by all pages on this domain. If you're trying to self-host
						a site that would normally be on a .alles.cx subdomain, you'll need
						to manually set the cookie.
					</SmallText>
				</Page>
			);
		} else {
			//Not Signed in
			const [formError, setFormError] = useState("");
			const [formLoading, setFormLoading] = useState(false);

			return (
				<Page title="Sign in" logo>
					<h1 style={{textAlign: "center"}}>Sign in to Alles</h1>
					<form
						onSubmit={e => {
							e.preventDefault();
							setFormError("");
							const username = e.target.username.value;
							const password = e.target.password.value;
							if (!username || !password || formLoading) return;
							setFormLoading(true);
							axios
								.post(`${config.apiUrl}/login`, {
									username,
									password
								})
								.then(res => {
									Cookies.set("sessionToken", res.data.token, {
										domain: location.host,
										expires: 365
									});
									const redirectUrl = props.router.query.redirect;
									window.location.href = redirectUrl ? redirectUrl : "/";
								})
								.catch(err => {
									if (err.response && err.response.status === 401) {
										setFormError("Your username or password is incorrect.");
										setFormLoading(false);
									} else {
										setFormError("Something went wrong.");
										setFormLoading(false);
									}
								});
						}}
					>
						<Input wide name="username" placeholder="Username" />
						<Input
							wide
							name="password"
							placeholder="Password"
							type="password"
						/>
						<Button disabled={formLoading} wide>
							Sign in
						</Button>
					</form>
					<SmallText>
						If you'd like to get early-access to Alles,{" "}
						<a
							href="https://twitter.com/AllesHQ/status/1221935058157744129"
							className="normal"
						>
							request access on Twitter
						</a>
						.
					</SmallText>
					{formError ? <p style={{color: "red"}}>{formError}</p> : <></>}
				</Page>
			);
		}
	}),
	`${config.apiUrl}/me`,
	true
);
