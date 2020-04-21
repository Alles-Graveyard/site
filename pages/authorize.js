import Page from "../layout/CardPage";
import {useState, useEffect} from "react";
import {withRouter} from "next/router";
import withAuth from "../reactants/withAuth";
import config from "../config";
import axios from "axios";

import Button from "../reactants/Button";
import SmallText from "../reactants/SmallText";
import theme from "../reactants/theme";

const AuthPage = props => {
	const [loading, setLoading] = useState(false);
	const [pageError, setError] = useState(props.error);

	//Authorize Application
	const authorizeApplication = async () => {
		setLoading(true);
		var res;
		try {
			res = await axios.post(
				`${config.apiUrl}/application/${encodeURIComponent(
					props.application.id
				)}/authorize`,
				{
					scopes: props.scopes.join(" "),
					redirectUri: props.redirectUri
				},
				{
					headers: {
						authorization: props.user.sessionToken
					}
				}
			);
		} catch (err) {
			return setError("An error occured while authorizing the application");
		}

		const code = res.data.code;
		window.location.href = `${props.redirectUri}?code=${encodeURIComponent(
			code
		)}&state=${encodeURIComponent(props.state)}`;
	};

	//If first party application, authorize automatically
	useEffect(() => {
		if (!props.error && props.application.firstParty) authorizeApplication();
	}, []);

	//Page Returned
	return props.error || !props.application.firstParty ? (
		<Page
			title="Authorize"
			logo
			user={props.user}
			breadcrumbs={
				!props.error
					? [
							{
								name: "authorize"
							},
							{
								name: props.application.name
							}
					  ]
					: []
			}
		>
			{pageError ? ( // Page Error
				<>
					<h3>Something went wrong</h3>
					<p>{pageError}</p>
					<SmallText>
						If you continue having issues, contact the developer of the app you
						are trying to sign in to. Refresh the page to try again.
					</SmallText>
				</>
			) : (
				// Authorization Prompt
				<>
					<h1>Sign in with Alles</h1>
					<div className="applicationInfo">
						<p>
							<span style={{color: theme.accent}}>
								{props.application.name}
							</span>{" "}
							allows you to {props.application.description}
						</p>
						{props.scopes.length > 0 ? (
							<>
								<p style={{marginBottom: 0}}>This application wants to:</p>
								<div className="scopes">
									{props.scopes.map(s => (
										<div key={s}>
											<p>{config.scopes[s]}</p>
										</div>
									))}
								</div>
							</>
						) : (
							<></>
						)}
					</div>

					<Button disabled={loading} wide onClick={authorizeApplication}>
						Continue
					</Button>
					<Button
						disabled={loading}
						wide
						secondary
						onClick={() => {
							setLoading(true);
							window.location.href = `${
								props.redirectUri
							}?error=aborted&state=${encodeURIComponent(props.state)}`;
						}}
					>
						Cancel
					</Button>

					<style jsx>{`
						.applicationInfo {
							min-height: 100px;
						}

						.scopes {
							padding: 0 10px;
						}

						.scopes div {
							font-size: 12px;
							padding: 10px;
						}

						.scopes div p {
							margin: 0;
						}

						.scopes div + div {
							border-top: solid 1px ${theme.borderGrey};
						}
					`}</style>
				</>
			)}
		</Page>
	) : (
		<p>One moment...</p>
	);
};

AuthPage.getInitialProps = async ctx => {
	//Basic query parameter checks
	if (!ctx.query.client_id)
		return {
			error: "A 'client_id' must be specified with the ID of the application"
		};
	if (ctx.query.response_type !== "code")
		return {error: "'response_type' must be set to 'code'"};
	if (!ctx.query.redirect_uri)
		return {error: "A 'redirect_uri' must be specified"};

	const state = ctx.query.state ? ctx.query.state : "";
	const scopes = (ctx.query.scope ? ctx.query.scope.split(" ") : []).filter(
		Boolean
	);
	const redirectUri = ctx.query.redirect_uri;

	//Verify Scopes
	for (const scope of scopes) {
		if (typeof config.scopes[scope] === "undefined")
			return {error: `'${scope}' is not a valid scope`};
	}

	//Get application data
	const {sessionToken} = ctx.user;
	var res;
	try {
		res = await axios.get(
			`${config.apiUrl}/application/${encodeURIComponent(ctx.query.client_id)}`,
			{
				headers: {
					authorization: sessionToken
				}
			}
		);
	} catch (err) {
		return {
			error: "There was an issue obtaining data for the application specified"
		};
	}

	const application = res.data;
	if (!application.callbackUrls.includes(redirectUri))
		return {
			error: "The callback url specified is not registered for this application"
		};

	return {
		application,
		state,
		scopes,
		redirectUri
	};
};

export default withAuth(withRouter(AuthPage), `${config.apiUrl}/me`);
