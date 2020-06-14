import Page from "../components/Page";
import withAuth from "../util/withAuth";
import axios from "axios";
import {Box, Spacer} from "@reactants/ui";
import {useState, useEffect} from "react";
import moment from "moment";
import {X} from "react-feather";

const page = props => {
	return (
		<Page
			title="Sessions"
			user={props.user}
			breadcrumbs={[
				{
					name: "Sessions"
				}
			]}
		>
			{props.sessions.map(session => (
				<Session
					key={session.id}
					session={session}
					s={props.user.session}
					token={props.user.sessionToken}
				/>
			))}
		</Page>
	);
};

page.getInitialProps = async ctx => {
	return (
		await axios.get(`${process.env.NEXT_PUBLIC_APIURL}/sessions`, {
			headers: {
				authorization: ctx.user.sessionToken
			}
		})
	).data;
};

export default withAuth(page);

const Session = ({session, s, token}) => {
	const [removed, setRemoved] = useState(false);
	const [date, setDate] = useState();

	useEffect(() => setDate(moment(session.createdAt).format("LLL")), []);

	return removed ? (
		<></>
	) : (
		<>
			<Spacer y={2} />
			<Box>
				<Box.Content
					style={{
						display: "flex"
					}}
				>
					<h1>{session.address}</h1>
					<h2>{date}</h2>
					<div className="icon">
						{session.id === s ? (
							<></>
						) : (
							<X
								style={{
									color: "var(--accents-6)",
									marginLeft: "auto",
									cursor: "pointer"
								}}
								onClick={() => {
									setRemoved(true);

									axios
										.post(
											`${process.env.NEXT_PUBLIC_APIURL}/sessions/revoke?id=${session.id}`,
											{},
											{
												headers: {
													authorization: token
												}
											}
										)
										.catch(() => {});
								}}
							/>
						)}
					</div>
				</Box.Content>

				<style jsx>{`
					h1,
					h2 {
						margin: auto 0;
					}

					h1 {
						font-weight: 500;
						font-size: 20px;
						flex-grow: 1;
						margin-right: 10px;
						${session.id === s ? "color: var(--primary);" : ""}
					}

					h2 {
						font-size: 15px;
						font-weight: 400;
						color: var(--accents-6);
						text-align: right;
					}

					.icon {
						width: 50px;
						display: flex;
						flex-flow: column;
						justify-content: center;
					}
				`}</style>
			</Box>
		</>
	);
};
