import Page from "../../../../layout/Page";
import config from "../../../../config";
import withAuth from "../../../../reactants/withAuth";
import {withRouter} from "next/router";
import theme from "../../../../reactants/theme";
import {useState} from "react";
import Input from "../../../../reactants/Input";
import Button from "../../../../reactants/Button";
import axios from "axios";
import {X} from "react-feather";

const memberPage = props => {
	if (props.member) {
		const [banner, setBanner] = useState({});
		const [roleInput, setRoleInput] = useState("");

		//Show Banner
		const showBanner = message => {
			setBanner({
				message,
				update: new Date().getTime()
			});
		};

		return (
			<Page
				title={`Modify @${props.member.username}`}
				header
				user={props.user}
				breadcrumbs={[
					{
						name: `$${props.member.team.slug}`,
						href: "/teams/[slug]",
						as: `/teams/${props.member.team.slug}`
					},
					{
						name: "members",
						href: "/teams/[slug]/members",
						as: `/teams/${props.member.team.slug}/members`
					},
					{
						name: `@${props.member.username}`
					}
				]}
				banner={banner}
			>
				<main>
					<h1 className="name">{props.member.name}</h1>
					<h2 className="username">@{props.member.username}</h2>
					<div className="roles">
						{props.member.roles.map(r => (
							<div className="role" key={r}>
								<div>
									<p>{r}</p>
								</div>
								{props.admin ? (
									<div>
										<X
											style={{
												cursor: "pointer",
												color: theme.grey8
											}}
											onClick={() => {
												axios
													.post(
														`${config.apiUrl}/teams/${encodeURIComponent(
															props.member.team.slug
														)}/members/${props.member.username}/removeRole`,
														{
															role: r
														},
														{
															headers: {
																authorization: props.user.sessionToken
															}
														}
													)
													.then(() => location.reload())
													.catch(() => showBanner("An error occurred."));
											}}
										/>
									</div>
								) : (
									<></>
								)}
							</div>
						))}
					</div>

					{props.admin ? (
						<form
							onSubmit={e => {
								e.preventDefault();
								const r = roleInput.trim();
								if (!r) return;
								if (r.length < config.inputBounds.role.min)
									return showBanner(
										`Roles must be at least ${config.inputBounds.role.min} characters long.`
									);
								axios
									.post(
										`${config.apiUrl}/teams/${encodeURIComponent(
											props.member.team.slug
										)}/members/${props.member.username}/addRole`,
										{
											role: r
										},
										{
											headers: {
												authorization: props.user.sessionToken
											}
										}
									)
									.then(() => location.reload())
									.catch(() => showBanner("An error occurred."));
							}}
						>
							<Input
								wide
								placeholder="manage-members"
								style={{
									marginTop: 50
								}}
								maxLength="32"
								onChange={e => setRoleInput(e.target.value)}
							/>
							<Button wide>Add Role</Button>
						</form>
					) : (
						<></>
					)}
				</main>

				<style jsx>{`
					main {
						background: white;
						border: solid 1px ${theme.borderGrey};
						padding: 20px;
						border-radius: 10px;
						overflow: auto;
						width: 600px;
						max-width: 100%;
						box-sizing: border-box;
						margin: 0 auto;
					}

					h1.name {
						text-align: center;
						margin: 0;
						margin-bottom: 5px;
					}

					h2.username {
						text-align: center;
						margin: 0;
						margin-bottom: 30px;
						font-weight: 500;
						font-size: 20px;
						color: ${theme.grey4};
					}

					.roles {
						border: solid 1px ${theme.borderGrey};
						border-radius: 5px;
					}

					.role {
						display: flex;
					}

					.role:not(:nth-child(1)) {
						border-top: solid 1px ${theme.borderGrey};
					}

					.role div:nth-child(1) {
						flex-grow: 1;
						margin: auto 10px;
					}

					.role div:nth-child(2) {
						flex-shrink: 0;
						margin: auto 10px;
					}
				`}</style>
			</Page>
		);
	} else {
		return (
			<Page title="Team Members" header user={props.user}>
				<p>Unable to access this team</p>
			</Page>
		);
	}
};

memberPage.getInitialProps = async ctx => {
	try {
		const admin = (
			await axios.get(
				`${config.apiUrl}/teams/${encodeURIComponent(ctx.query.slug)}/members/${
					ctx.user.username
				}`,
				{
					headers: {
						authorization: ctx.user.sessionToken
					}
				}
			)
		).data.admin;

		const member = (
			await axios.get(
				`${config.apiUrl}/teams/${encodeURIComponent(ctx.query.slug)}/members/${
					ctx.query.username
				}`,
				{
					headers: {
						authorization: ctx.user.sessionToken
					}
				}
			)
		).data;

		return {
			member,
			admin
		};
	} catch (err) {}
};

export default withAuth(withRouter(memberPage), `${config.apiUrl}/me`);
