import Page from "../../layout/Page";
import withAuth from "../../reactants/withAuth";
import theme from "../../reactants/theme";
import config from "../../config";
import axios from "axios";
import {withRouter} from "next/router";
import Verified from "../../reactants/Verified";

const teamPage = props => {
	if (props.team) {
		return (
			<Page title={`$${props.team.slug}`} header user={props.user}>
				<section className="info">
					<h1>{props.team.name}</h1>
					<h2>
						${props.team.slug}
						{props.team.verified ? (
							<>
								{" "}
								<Verified />
							</>
						) : (
							<></>
						)}
					</h2>
					<p>
						This team has {props.team.memberCount} member
						{props.team.memberCount === 1 ? "" : "s"}.
					</p>
					{props.team.developer ? (
						<p>
							This team has <span>developer</span> features enabled.
						</p>
					) : (
						<></>
					)}
					{props.team.isMember ? (
						<>
							<p>
								You are {props.team.isAdmin ? "an admin" : "a member"} of this
								team.
							</p>
							<p>
								Team Plan: <span>{props.team.plan.toUpperCase()}</span>
							</p>
							<p>
								Stardust: <span>{props.team.stardust}</span>
							</p>
							<h3>Your Roles:</h3>
							<div className="roles">
								{props.team.roles.length > 0 ? (
									props.team.roles.map(r => <span key={r}>{r}</span>)
								) : (
									<p>You have no roles.</p>
								)}
							</div>
						</>
					) : (
						<></>
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
					}

					section.info span {
						color: ${theme.accent};
					}

					h1 {
						margin: 0;
						font-size: 40px;
					}

					h2 {
						color: ${theme.grey4};
						font-weight: 400;
						font-size: 20px;
						margin: 0;
					}

					h3 {
						margin-top: 30px;
						margin-bottom: 0;
					}

					.roles {
						display: flex;
						flex-wrap: wrap;
						justify-content: center;
					}

					.roles span {
						border: solid 1px ${theme.borderGrey};
						color: #000000 !important;
						padding: 0 10px;
						border-radius: 9999px;
						margin: 5px;
						text-align: center;
					}

					.roles p {
						margin-top: 5px;
					}
				`}</style>
			</Page>
		);
	} else {
		//Team does not exist
		return (
			<Page header user={props.user}>
				<p>Invalid Team</p>
			</Page>
		);
	}
};

teamPage.getInitialProps = async ctx => {
	const {slug} = ctx.query;
	const {sessionToken} = ctx.user;

	try {
		return {
			team: (
				await axios.get(
					`${config.apiUrl}/team?slug=${encodeURIComponent(
						slug.toLowerCase()
					)}`,
					{
						headers: {
							authorization: sessionToken
						}
					}
				)
			).data
		};
	} catch (err) {
		return {
			team: null
		};
	}
};

export default withAuth(withRouter(teamPage), `${config.apiUrl}/me`);
