import Page from "../layout/Page";
import withAuth from "../reactants/withAuth";
import theme from "../reactants/theme";
import config from "../config";
import Link from "next/link";
import axios from "axios";
import {withRouter} from "next/router";
import WideUser from "../components/WideUser";

const people = props => {
	const backwardsBtn =
		props.users.length > 0 && !props.firstPage ? props.users[0].username : null;
	const forwardsBtn =
		props.users.length > 0 && !props.lastPage
			? props.users[props.users.length - 1].username
			: null;
	return (
		<Page header user={props.user} title="Users">
			{props.users.length > 0 ? (
				<>
					<NavArrows before={backwardsBtn} after={forwardsBtn} />
					{props.users.map(u => (
						<Link href="/u/[username]" as={`/u/${u.username}`} key={u.id}>
							<a>
								<WideUser user={u} />
							</a>
						</Link>
					))}
					<NavArrows before={backwardsBtn} after={forwardsBtn} />
				</>
			) : (
				<div style={{textAlign: "center"}}>
					<h1>Error</h1>
					<p>No users were found.</p>
				</div>
			)}

			<style jsx>{`
				a {
					max-width: 800px;
					margin: 20px auto;
					display: block;
				}
			`}</style>
		</Page>
	);
};

people.getInitialProps = async ctx => {
	const {before, after} = ctx.query;
	const {sessionToken} = ctx.user;

	return (
		await axios.get(
			`${config.apiUrl}/users${
				after
					? `?after=${encodeURIComponent(after)}`
					: before
					? `?before=${before}`
					: ""
			}`,
			{
				headers: {
					authorization: sessionToken
				}
			}
		)
	).data;
};

export default withRouter(withAuth(people, `${config.apiUrl}/me`));

//Navigation Arrows
const NavArrows = ({before, after}) => (
	<div>
		{before ? (
			<a href={`/people?before=${before}`}>
				<i className="material-icons">navigate_before</i>
			</a>
		) : (
			<a className="disabled">
				<i className="material-icons">navigate_before</i>
			</a>
		)}
		{after ? (
			<a href={`/people?after=${after}`}>
				<i className="material-icons">navigate_next</i>
			</a>
		) : (
			<a className="disabled">
				<i className="material-icons">navigate_next</i>
			</a>
		)}

		<style jsx>{`
			div {
				display: flex;
				justify-content: center;
			}

			a {
				display: block;
				background: white;
				width: 30px;
				height: 30px;
				margin: 0 10px;
				display: flex;
				border: solid 1px ${theme.borderGrey};
				border-radius: 50%;
			}

			a.disabled {
				background: none;
				color: ${theme.grey4};
			}

			i {
				margin: auto;
				display: block;
			}
		`}</style>
	</div>
);
