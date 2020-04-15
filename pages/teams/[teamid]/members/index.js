import Page from "../../../../layout/Page";
import config from "../../../../config";
import withAuth from "../../../../reactants/withAuth";
import {withRouter} from "next/router";
import theme from "../../../../reactants/theme";
import {useState} from "react";
import Button from "../../../../reactants/Button";

const membersPage = props => {
	const [removeConfirm, setRemoveConfirm] = useState();

	if (props.team) {
		return (
			<Page title="Team Members" header user={props.user}>
				<main>
					<h1 className="name">{props.team.name}</h1>
					<h2 className="slug">${props.team.slug}</h2>
					<table>
						<tbody>
							{props.team.members.map(m =>
								m.id !== removeConfirm ? (
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
											{m.admin ? (
												<i className="material-icons">security</i>
											) : (
												<></>
											)}
											<i className="material-icons">edit</i>
											{props.team.members.length > 1 ? (
												<i
													className="material-icons"
													onClick={() => setRemoveConfirm(m.id)}
												>
													clear
												</i>
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
													Remove <span>@
													{
														props.team.members[
															Object.keys(props.team.members)[
																props.team.members
																	.map(member => member.id)
																	.indexOf(removeConfirm)
															]
														].username
													}</span> from this team?
												</p>
                                                <Button style={{margin: "0 10px"}}>Confirm</Button>
                                                <Button secondary onClick={() => setRemoveConfirm()}>Cancel</Button>
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

					.member td:nth-child(3) i {
						margin: 0 5px;
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

membersPage.getInitialProps = ctx => {
	return {
		team: {
			id: "e51553f7-234b-4e3d-be4b-33ce38406e6d",
			slug: "alles",
			name: "Alles",
			members: [
				{
					id: "00000000-0000-0000-0000-000000000000",
					name: "Archie Baer",
					username: "archie",
					admin: true,
					roles: []
				},
				{
					id: "b9138df4-a681-4515-8d06-14505de15b6d",
					name: "Marcel Braun",
					username: "marcel",
					admin: false,
					roles: [
						"claim-domains",
						"pipe-alles-cc",
						"a",
						"b",
						"c",
						"d",
						"e",
						"f",
						"g",
						"h",
						"i",
						"j",
						"k",
						"l",
						"m"
					]
				},
				{
					id: "b0d18612-1eff-4be2-b0bc-46ea4df28a96",
					name: "Levi Scott Hicks",
					username: "levi",
					admin: false,
					roles: ["pipe-alles-cc"]
				}
			]
		}
	};
};

export default withAuth(withRouter(membersPage), `${config.apiUrl}/me`);
