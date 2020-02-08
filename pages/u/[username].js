import Page from "../../layout/Page";
import withAuth from "../../util/withAuth";
import theme from "../../theme";
import config from "../../config";
import axios from "axios";
import { withRouter } from "next/router";
import nextCookie from "next-cookies";
import { useState } from "react";

import Link from "next/link";
import Button from "../../components/Button";

const userPage = props => {
	if (props.requestedUser) {
		const self = props.requestedUser.id === props.user.id;
		const [followed, setFollowed] = useState(props.requestedUser.followed);

		const toggleFollow = () => {
			setFollowed(!followed);
			axios
				.post(
					`${config.apiUrl}/${followed ? "unfollow" : "follow"}/${
						props.requestedUser.id
					}`,
					{},
					{
						headers: {
							authorization: props.user.sessionToken
						}
					}
				)
				.catch(() => {});
		};

		const userButtonStyle = { margin: "5px 10px", padding: 5, width: 100 };

		return (
			<Page title={`@${props.requestedUser.username}`} header user={props.user}>
				<section className="banner"></section>
				<section className="user">
					<div className="profilePicture">
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
					<h2 className="counts">
						<span>
							<b>{props.requestedUser.followers}</b>{" "}
							{props.requestedUser.followers === 1 ? "Follower" : "Followers"}
						</span>
						<span>
							<b>{props.requestedUser.rubies}</b>{" "}
							{props.requestedUser.rubies === 1 ? "Ruby" : "Rubies"}
						</span>
					</h2>
					<h2 className="tagline">{props.requestedUser.about}</h2>
					{self ? (
						<></>
					) : (
						<>
							<Button
								style={userButtonStyle}
								secondary={!followed}
								onClick={toggleFollow}
							>
								{!followed ? "Follow" : "Following"}
							</Button>
							<Button style={userButtonStyle} secondary>
								Message
							</Button>
						</>
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

					h2.username {
						font-size: 15px;
						font-weight: 400;
						margin: 0;
						margin-bottom: 5px;
						color: ${theme.accent};
					}

					h2.counts {
						font-size: 12px;
						font-weight: 400;
						margin: 0;
						margin-bottom: 10px;
						color: ${theme.grey4};
					}

					h2.counts span {
						margin: 0 10px;
					}

					h2.counts b {
						color: black;
					}

					h2.tagline {
						font-size: 15px;
						font-weight: 400;
						margin: 0;
						margin-bottom: 20px;
						color: ${theme.grey4};
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
		);
	} else {
		//User does not exist
		return (
			<Page title="My Account" header user={props.user}>
				<p>Invalid User</p>
			</Page>
		);
	}
};

userPage.getInitialProps = async ctx => {
	const { username } = ctx.query;
	const { sessionToken } = nextCookie(ctx);
	if (!sessionToken) return;

	var apiReq;
	try {
		apiReq = await axios.get(
			`${config.apiUrl}/user?username=${encodeURIComponent(
				username.toLowerCase()
			)}`,
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
		requestedUser: apiReq.data
	};
};

export default withAuth(withRouter(userPage));
