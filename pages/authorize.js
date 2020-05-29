import Page from "../components/ColumnPage";
import {useState, useEffect} from "react";
import {withRouter} from "next/router";
import withAuth from "../util/withAuth";
import config from "../config";
import axios from "axios";
import {Button, Box, Spacer} from "@reactants/ui";
import WideUser from "../components/WideUser";

const page = props => {
	const [loading, setLoading] = useState(false);
	const [pageError, setError] = useState(props.error);
	const [account, setAccount] = useState();

	// Authorize Application
	const authorizeApplication = async userId => {
		setLoading(true);
		var res;
		try {
			res = await axios.post(
				`${process.env.NEXT_PUBLIC_APIURL}/application/${encodeURIComponent(
					props.application.id
				)}/authorize`,
				{
					scopes: props.scopes.join(" "),
					redirectUri: props.redirectUri,
					user: userId
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

	// If first party application, authorize automatically
	useEffect(() => {
		if (!props.error && props.application.firstParty)
			authorizeApplication(props.user.id);
	}, []);

	// Page Returned
	return props.error || !props.application.firstParty ? (
		<Page
			title="Authorize"
			width="500px"
			user={props.user}
			breadcrumbs={
				!props.error
					? [
							{
								name: "Authorize"
							},
							{
								name: props.application.name
							}
					  ]
					: []
			}
		>
			<Box>
				<Box.Header>
					{pageError ? "Something went wrong" : "Sign in with Alles"}
				</Box.Header>
				<Box.Content>
					{pageError ? (
						// Page Error
						<>
							<p>{pageError}</p>
							<p
								style={{
									color: "var(--accents-4)",
									fontSize: 10
								}}
							>
								If you continue having issues, contact the developer of the app
								you are trying to sign in to. Refresh the page to try again.
							</p>
						</>
					) : (
						// Authorization Prompt
						<>
							{account ? (
								<>
									<div className="applicationInfo">
										<p>
											<span style={{color: "var(--primary)"}}>
												{props.application.name}
											</span>{" "}
											allows you to {props.application.description}
										</p>
										{props.scopes.length > 0 ? (
											<>
												<p style={{marginBottom: 0}}>
													This application wants to:
												</p>
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

									<Button
										loading={loading}
										fluid
										primary
										onClick={() => authorizeApplication(account)}
									>
										Continue
									</Button>

									<Spacer y={0.5} />

									<Button
										loading={loading}
										fluid
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
								</>
							) : (
								<>
									<p>Which account do you wish to proceed with?</p>
									<WideUser
										user={props.accounts.primary}
										style={{cursor: "pointer"}}
										onClick={() => setAccount(props.accounts.primary.id)}
									/>
									{props.accounts.secondaries.map(account => (
										<WideUser
											key={account.id}
											user={account}
											style={{cursor: "pointer"}}
											onClick={() => setAccount(account.id)}
										/>
									))}
								</>
							)}

							<style jsx>{`
								.applicationInfo {
									min-height: 100px;
									margin-bottom: 20px;
								}

								.scopes {
									padding: 0 10px;
									margin: 10px 0;
									border: solid 1px var(--accents-2);
								}

								.scopes div {
									font-size: 12px;
									padding: 10px;
								}

								.scopes div p {
									margin: 0;
								}

								.scopes div + div {
									border-top: solid 1px var(--accents-2);
								}
							`}</style>
						</>
					)}
				</Box.Content>
			</Box>
		</Page>
	) : (
		<p>One moment...</p>
	);
};

page.getInitialProps = async ctx => {
	// Basic query parameter checks
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

	// Verify Scopes
	for (const scope of scopes) {
		if (typeof config.scopes[scope] !== "string")
			return {error: `'${scope}' is not a valid scope`};
	}

	// Get application data
	let application;
	try {
		application = (
			await axios.get(
				`${process.env.NEXT_PUBLIC_APIURL}/application/${encodeURIComponent(
					ctx.query.client_id
				)}`,
				{
					headers: {
						authorization: ctx.user.sessionToken
					}
				}
			)
		).data;
	} catch (err) {
		return {
			error: "There was an issue obtaining data for the application specified"
		};
	}

	if (!application.callbackUrls.includes(redirectUri))
		return {
			error: "The callback url specified is not registered for this application"
		};

	// Get Accounts
	const accounts = (
		await axios.get(`${process.env.NEXT_PUBLIC_APIURL}/accounts`, {
			headers: {
				authorization: ctx.user.sessionToken
			}
		})
	).data;

	return {
		application,
		state,
		scopes,
		redirectUri,
		accounts
	};
};

export default withAuth(withRouter(page));
