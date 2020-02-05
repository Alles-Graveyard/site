import Page from "../../layout/Page";
import withAuth from "../../util/withAuth";
import theme from "../../theme";
import config from "../../config";
import axios from "axios";
import {withRouter} from "next/router";
import nextCookie from "next-cookies";

import Link from "next/link";

const userPage = props => {
	return props.requestedUser ? (
		<Page title={`@${props.requestedUser.username}`} header user={props.user}>
			<section className="banner">

			</section>
			<section className="user">
				<div
					className="profilePicture"
				>
					<img
						className="picture"
						src={`https://avatar.alles.cx/user/${props.requestedUser.id}`}
					/>
				</div>
				<h1 className="name">
					{props.requestedUser.name}
					{props.requestedUser.plus ? <sup>+</sup> : <></>}
				</h1>
				<h2 className="username">@{props.requestedUser.username}</h2>
				<h2 className="tagline">{props.requestedUser.about}</h2>
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

				h1.sectionTitle {
					border-left: solid 5px;
					padding-left: 10px;
					padding-right: 5px;
					transition: 0.1s;
				}

				section:hover h1.sectionTitle {
					border-color: ${theme.accent};
					padding-left: 15px;
					padding-right: 0px;
				}

				section.banner {
					height: 150px;
					margin-bottom: 0;
					border-bottom-left-radius: 0;
					border-bottom-right-radius: 0;
					background: ${theme.accent};
				}

				section.user {
					padding-top: 0;
					text-align: center;
					margin-top: 10px;
					border-top-left-radius: 0;
					border-top-right-radius: 0;
				}

				.profilePicture {
					border: solid 10px ${theme.greyF};
					border-radius: 50%;
					height: 200px;
					width: 200px;
					position: relative;
					top: -100px;
					margin: 0 auto;
					margin-bottom: -100px;
					box-sizing: border-box;
					background: white;
					overflow: hidden;
				}

				.profilePicture img {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					transition: 0.1s;
				}

				h1.name {
					font-size: 30px;
					margin: 0;
					margin-top: 10px;
					font-weight: 500;
				}

				h2.tagline {
					font-size: 15px;
					font-weight: 400;
					margin: 0;
					margin-bottom: 20px;
					color: ${theme.grey4};
				}

				h2.username {
					font-size: 15px;
					font-weight: 400;
					margin: 0;
					margin-bottom: 10px;
					color: ${theme.accent};
				}

				@media screen and (max-width: 450px) {
					.profilePicture {
						height: 120px;
						width: 120px;
						top: -60px;
						margin-bottom: -80px;
					}
				}
			`}</style>
		</Page>
	) : (
		<Page title="My Account" header user={props.user}>
			<p>Invalid User</p>
		</Page>
	);
};

userPage.getInitialProps = async ctx => {
	const {username} = ctx.query;
	const { sessionToken } = nextCookie(ctx);
	if (!sessionToken) return;

	var apiReq;
	try {
		apiReq = await axios.get(`${config.apiUrl}/user?username=${encodeURIComponent(username)}`, {
			headers: {
				authorization: sessionToken
			}
		});
	} catch (err) {
		return;
	}

    return {
		requestedUser: apiReq.data
	};
};

export default withAuth(withRouter(userPage));