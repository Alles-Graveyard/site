import Page from "../../../../layout/Page";
import config from "../../../../config";
import withAuth from "../../../../reactants/withAuth";
import {withRouter} from "next/router";
import theme from "../../../../reactants/theme";
import {useState} from "react";
import Button from "../../../../reactants/Button";
import axios from "axios";
import {X, Edit2, Shield} from "react-feather";
import Link from "next/link";

const membersPage = props => {
	const [removeConfirm, setRemoveConfirm] = useState();
	const [banner, setBanner] = useState({});
	const iconBtnStyles = {
		padding: "0 5px",
		cursor: "pointer"
	};
	
	if (props.team) {
		return (
			<Page
				title="Team Members"
				header
				user={props.user}
				breadcrumbs={[
					{
						name: `$${props.team.slug}`,
						href: "/teams/[slug]",
						as: `/teams/${props.team.slug}`
					},
					{
						name: "members"
					}
				]}
				banner={banner}
			>
				<main>
					<h1 className="name">{props.team.name}</h1>
					<h2 className="slug">${props.team.slug}</h2>
					<table>
						<tbody>
							{props.team.members.map(m =>
								m.username !== removeConfirm ? (
									<tr key={m.id} className="member">
										<td>
											<img src={`https://avatar.alles.cx/user/${m.id}`} />
											<div>
												<h1>{m.name}</h1>
												<h2>@{m.username}</h2>
											</div>
										</td>
										<td>
											{m.roles.map(r => (
												<span key={r}>{r}</span>
											))}
										</td>
										<td>
											{m.admin ? <Shield style={iconBtnStyles} /> : <></>}
											<Link href="/teams/[slug]/members/[username]" as={`/teams/${props.team.slug}/members/${m.username}`}>
												<a>
													<Edit2 style={iconBtnStyles} />
												</a>
											</Link>
											{props.team.members.length > 1 ? (
												<X
													style={iconBtnStyles}
													onClick={() => setRemoveConfirm(m.username)}
												/>
											) : (
												<></>
											)}
										</td>
									</tr>
								) : (
									<tr key={m.id} className="remove">
										<td colSpan="3">
											<div>
												<p>
													Remove{" "}
													<span>
														@{removeConfirm}
													</span>{" "}
													from this team?
												</p>
												<Button style={{margin: "0 10px"}} onClick={() => {
													axios.post(
														`${config.apiUrl}/teams/${encodeURIComponent(
															props.team.slug
														)}/members/${encodeURIComponent(removeConfirm)}/remove`,
														{},
														{
															headers: {
																authorization: props.user.sessionToken
															}
														}
													).then(() => {
														location.reload();
													}).catch(() => {
														setBanner({
															message: "An error occurred while removing this team member",
															update: new Date().getTime()
														});
													});
												}}>Confirm</Button>
												<Button secondary onClick={() => setRemoveConfirm()}>
													Cancel
												</Button>
											</div>
										</td>
									</tr>
								)
							)}
						</tbody>
					</table>
				</main>

				<style jsx>{`
					main {
						background: white;
						border: solid 1px ${theme.borderGrey};
						padding: 20px;
						border-radius: 10px;
						overflow: auto;
					}

					h1.name {
						text-align: center;
						margin: 0;
						margin-bottom: 5px;
					}

					h2.slug {
						text-align: center;
						margin: 0;
						margin-bottom: 30px;
						font-weight: 500;
						font-size: 20px;
						color: ${theme.grey4};
					}

					table {
						width: 100%;
					}

					.member td {
						margin: 10px 0;
					}

					.member td:nth-child(1) {
						display: flex;
					}

					.member td:nth-child(1) img {
						height: 50px;
						width: 50px;
						border-radius: 50%;
						border: solid 1px ${theme.borderGrey};
						margin-right: 10px;
						flex-shrink: 0;
					}

					.member td:nth-child(1) div {
						margin: auto 0;
					}

					.member td:nth-child(1) h1 {
						font-weight: 500;
						font-size: 15px;
						margin: 0;
					}

					.member td:nth-child(1) h2 {
						font-weight: 400;
						font-size: 15px;
						margin: 0;
						color: ${theme.grey4};
					}

					.member td:nth-child(2) span {
						border: solid 1px ${theme.borderGrey};
						display: inline-block;
						margin: 5px;
						padding: 5px;
					}

					.member td:nth-child(3) {
						color: ${theme.grey8};
						text-align: right;
						min-width: 120px;
					}

					tr.remove div {
						border: 1px ${theme.borderGrey};
						border-style: solid none;
						text-align: center;
					}

					tr.remove p {
						margin-bottom: 5px;
					}

					tr.remove span {
						color: ${theme.accent};
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

membersPage.getInitialProps = async ctx => {
	try {
		return {
			team: (
				await axios.get(
					`${config.apiUrl}/teams/${encodeURIComponent(
						ctx.query.slug
					)}/members`,
					{
						headers: {
							authorization: ctx.user.sessionToken
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

export default withAuth(withRouter(membersPage), `${config.apiUrl}/me`);
