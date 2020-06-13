import Page from "../components/Page";
import withAuth from "../util/withAuth";
import axios from "axios";
import {Box, Spacer} from "@reactants/ui";
import {useState, useEffect} from "react";
import moment from "moment";

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
				<React.Fragment key={session.id}>
					<Spacer y={2} />
					<Session session={session} s={props.user.session} />
				</React.Fragment>
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

const Session = ({session, s}) => {
	const [removed, setRemoved] = useState(false);
	const [date, setDate] = useState();

	useEffect(() => setDate(moment(session.createdAt).format("LLL")), []);

	return removed ? (
		<></>
	) : (
		<Box>
			<Box.Content
				style={{
					display: "flex"
				}}
			>
				<h1>
					{session.address}
					{session.id === s
						? " (this session)"
						: session.thisNetwork
						? " (this network)"
						: ""}
				</h1>
				<h2>{date}</h2>
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
			`}</style>
		</Box>
	);
};
