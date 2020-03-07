import Page from "../layout/CardPage";
import { useState } from "react";
import { withRouter } from "next/router";
import Cookies from "js-cookie";
import config from "../config";
import axios from "axios";

import Input from "../components/Input";
import Button from "../components/Button";
import SmallText from "../components/SmallText";
import theme from "../theme";

export default withRouter(props => {
	const [formError, setFormError] = useState("");
	const [formLoading, setFormLoading] = useState(false);

	return (
		<Page title="Log in" logo>
			<h1 style={{ textAlign: "center" }}>Sign in to Alles</h1>
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
								domain: location.host
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
				<Input wide name="password" placeholder="Password" type="password" />
				<Button disabled={formLoading} wide>
					Sign in
				</Button>
			</form>
			<SmallText>
				If you'd like to get early-access to Alles,{" "}
				<a
					href="https://twitter.com/AllesHQ/status/1221935058157744129"
					className="nocolor"
				>
					request access on Twitter
				</a>
				.
			</SmallText>
			{formError ? <p style={{ color: theme.error }}>{formError}</p> : <></>}
		</Page>
	);
});
