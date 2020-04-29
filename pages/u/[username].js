import Page from "../../layout/Page";
import withAuth from "../../reactants/withAuth";
import theme from "../../reactants/theme";
import config from "../../config";
import axios from "axios";
import {withRouter} from "next/router";
import {useState} from "react";
import Button from "../../reactants/Button";
import Post from "../../components/Post";

const userPage = props => {
	if (props.requestedUser) {
		const self = props.requestedUser.id === props.user.id;
		const [isFollowing, setIsFollowing] = useState(
			props.requestedUser.isFollowing
		);

		const toggleFollow = () => {
			setIsFollowing(!isFollowing);
			axios
				.post(
					`${config.apiUrl}/users/${props.requestedUser.username}/${
						isFollowing ? "unfollow" : "follow"
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

		const userButtonStyle = {margin: "5px 10px", padding: 5, width: 100};

		return (
			<Page
				title={`@${props.requestedUser.username}`}
				header
				user={props.user}
				breadcrumbs={[
					{
						name: `@${props.requestedUser.username}`
					}
				]}
			>
				<section className="banner"></section>
				<section className="user">
					<img
						className="profilePicture"
						src={`https://avatar.alles.cx/user/${props.requestedUser.id}`}
					/>
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
								secondary={!isFollowing}
								onClick={toggleFollow}
							>
								{!isFollowing ? "Follow" : "Following"}
							</Button>
						</>
					)}
				</section>

				<div className="posts">
					{props.requestedUser.posts.map(p => (
						<Post
							key={p.slug}
							data={p}
							sessionToken={props.user.sessionToken}
							link
						/>
					))}
				</div>

				<style jsx>{`
					section {
						background: white;
						width: 600px;
						max-width: 100%;
						margin: 20px auto;
						border: solid 1px ${theme.borderGrey};
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
						border: solid 1px ${theme.borderGrey};
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

					@media screen and (max-width: 450px) {
						.profilePicture {
							height: 120px;
							width: 120px;
							top: -60px;
							margin-bottom: -60px;
						}
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

					div.posts {
						width: 600px;
						max-width: 100%;
						margin: 0 auto;
					}
				`}</style>
			</Page>
		);
	} else {
		//User does not exist
		return (
			<Page header user={props.user}>
				<p>Invalid User</p>
			</Page>
		);
	}
};

userPage.getInitialProps = async ctx => {
	const {username} = ctx.query;
	const {sessionToken} = ctx.user;

	try {
		return {
			requestedUser: (
				await axios.get(
					`${config.apiUrl}/users/${encodeURIComponent(
						username.toLowerCase()
					)}`,
					{
						headers: {
							authorization: sessionToken
						}
					}
				)
			).data
		};
	} catch (err) {}
};

export default withAuth(withRouter(userPage), `${config.apiUrl}/me`);
