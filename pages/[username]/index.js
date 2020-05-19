import Page from "../../components/Page";
import withAuth from "../../util/withAuth";
import axios from "axios";
import {withRouter} from "next/router";
import {useState} from "react";
import {Button, Box, Spacer} from "@reactants/ui";
import Post from "../../components/Post";
import PostField from "../../components/PostField";
import NotFound from "../404";

const page = props => {
	if (props.requestedUser) {
		const self = props.requestedUser.id === props.user.id;
		const [isFollowing, setIsFollowing] = useState(
			props.requestedUser.isFollowing
		);

		const toggleFollow = () => {
			setIsFollowing(!isFollowing);
			axios
				.post(
					`${process.env.apiUrl}/users/${props.requestedUser.username}/${
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

		return (
			<Page
				title={`@${props.requestedUser.username}`}
				user={props.user}
				breadcrumbs={[
					{
						name: `@${props.requestedUser.username}`
					}
				]}
			>
				<Box
					style={{
						height: 150,
						background: "var(--primary)",
						borderBottomLeftRadius: 0,
						borderBottomRightRadius: 0
					}}
				/>

				<Box
					style={{
						textAlign: "center",
						borderTopLeftRadius: 0,
						borderTopRightRadius: 0,
						padding: "0 20px 20px"
					}}
				>
					<img
						className="profilePicture"
						src={`https://avatar.alles.cx/u/${props.requestedUser.username}`}
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
								style={{
									margin: "0 auto",
									width: 100
								}}
								small
								primary={isFollowing}
								secondary={!isFollowing}
								onClick={toggleFollow}
							>
								{!isFollowing ? "Follow" : "Following"}
							</Button>
						</>
					)}
				</Box>

				{self ? (
					<>
						<Spacer y={2} />
						<PostField
							placeholder="What's up?"
							sessionToken={props.user.sessionToken}
						/>
					</>
				) : (
					<></>
				)}

				{props.requestedUser.posts.map(p => (
					<React.Fragment key={p.slug}>
						<Spacer y={2} />
						<Post
							data={p}
							self={props.user.id === p.author.id}
							sessionToken={props.user.sessionToken}
						/>
					</React.Fragment>
				))}

				<style jsx global>{`
					:root,
					:root.dark-mode {
						${props.requestedUser.color
							? `--primary: ${props.requestedUser.color}`
							: ``};
					}
				`}</style>

				<style jsx>{`
					.profilePicture {
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
						color: var(--primary);
					}

					h2.counts {
						font-size: 12px;
						font-weight: 400;
						margin: 0;
						margin-bottom: 10px;
						color: var(--accents-6);
					}

					h2.counts span {
						margin: 0 10px;
					}

					h2.counts b {
						color: var(--foreground);
					}

					h2.tagline {
						font-size: 15px;
						font-weight: 400;
						margin: 0;
						margin-bottom: 20px;
						color: var(--accents-6);
					}
				`}</style>
			</Page>
		);
	} else {
		//User does not exist
		return <NotFound />;
	}
};

page.getInitialProps = async ctx => {
	const {username} = ctx.query;
	const {sessionToken} = ctx.user;

	try {
		return {
			requestedUser: (
				await axios.get(
					`${process.env.apiUrl}/users/${encodeURIComponent(
						username.toLowerCase()
					)}?posts`,
					{
						headers: {
							authorization: sessionToken
						}
					}
				)
			).data
		};
	} catch (err) {
		if (ctx.res) ctx.res.statusCode = 404;
	}
};

export default withAuth(withRouter(page));
