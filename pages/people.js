import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import theme from "../theme";
import config from "../config";
import Link from "next/link";
import axios from "axios";
import {withRouter} from "next/router";

const people = props => {
	return (
		<Page header user={props.user} title="Users">
			{props.users.map(u => (
				<Link href="/u/[id]" as={`/u/${u.username}`} key={u.id}>
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

			<style jsx>{`
				.user {
					display: flex;
					background: #ffffff;
					padding: 20px;
					margin: 20px 0;
					border-radius: 20px;
					border: solid 1px ${theme.borderGrey};
				}

                .user:hover, .user:hover img {
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
			`${config.apiUrl}/users${after ? `?after=${encodeURIComponent(after)}` : before ? `?before=${before}` : ""}`,
			{
				headers: {
					authorization: sessionToken
				}
			}
		);
	} catch (err) {
		return;
	}

	return {
		users: apiReq.data
	};
};

export default withRouter(withAuth(people));
