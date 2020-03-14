import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import theme from "../theme";
import config from "../config";
import Link from "next/link";
import axios from "axios";
import { withRouter } from "next/router";

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
							<a className="user">
								<div className="left">
									<img src={`https://avatar.alles.cx/user/${u.id}`} />
									<h1>
										{u.name}
										{props.user.plus ? <sup>+</sup> : <></>}
									</h1>
								</div>
								<h2>@{u.username}</h2>
							</a>
						</Link>
					))}
					<NavArrows before={backwardsBtn} after={forwardsBtn} />
				</>
			) : (
				<div style={{ textAlign: "center" }}>
					<h1>Error</h1>
					<p>No users were found.</p>
				</div>
			)}

			<style jsx>{`
				.user {
					display: flex;
					background: #ffffff;
					padding: 20px;
					margin: 20px auto;
					max-width: 800px;
					border-radius: 20px;
					border: solid 1px ${theme.borderGrey};
				}

				.user:hover,
				.user:hover img {
					border-color: ${theme.grey8};
				}

				.user h1 {
					font-size: 20px;
					font-weight: 500;
					margin: auto 0;
				}

				.user h2 {
					font-size: 15px;
					font-weight: 400;
					margin: auto 0;
					color: ${theme.grey4};
					text-align: right;
				}

				.user img {
					height: 30px;
					width: 30px;
					border-radius: 50%;
					margin-right: 10px;
					border: solid 1px ${theme.borderGrey};
				}

				.user .left {
					display: flex;
					flex-grow: 1;
				}
			`}</style>
		</Page>
	);
};

people.getInitialProps = async ctx => {
	const { before, after } = ctx.query;
	const { sessionToken } = ctx.user;

	var apiReq;
	try {
		apiReq = await axios.get(
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
		);
	} catch (err) {
		return;
	}

	return apiReq.data;
};

export default withRouter(withAuth(people));

//Navigation Arrows
const NavArrows = ({ before, after }) => (
	<div>
		{before ? (
			<a href={`/people?before=${before}`}>
				<i className="fas fa-arrow-left"></i>
			</a>
		) : (
			<a className="disabled">
				<i className="fas fa-arrow-left"></i>
			</a>
		)}
		{after ? (
			<a href={`/people?after=${after}`}>
				<i className="fas fa-arrow-right"></i>
			</a>
		) : (
			<a className="disabled">
				<i className="fas fa-arrow-right"></i>
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
