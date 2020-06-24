import Page from "../../components/Page";
import withAuth from "../../util/withAuth";
import axios from "axios";
import {withRouter} from "next/router";
import {useState, useEffect} from "react";
import {Button, Box, Spacer} from "@reactants/ui";
import Post from "../../components/Post";
import PostField from "../../components/PostField";
import NotFound from "../404";
import Tags from "../../components/Tags";
import Link from "next/link";
import UserStatus from "../../components/UserStatus";

const page = props => {
	if (props.requestedUser) {
		const self = props.requestedUser.id === props.user.id;
		const [isFollowing, setIsFollowing] = useState(
			props.requestedUser.following
		);

		// Pride Month
		const [pride, setPride] = useState(false);
		useEffect(
			() =>
				setPride(
					new Date().getMonth() === 5 &&
						props.requestedUser.about.includes("🏳️‍🌈")
				),
			[]
		);

		// Toggle Follow
		const toggleFollow = () => {
			setIsFollowing(!isFollowing);
			axios
				.post(
					`${process.env.NEXT_PUBLIC_APIURL}/users/${
						props.requestedUser.username
					}/${isFollowing ? "unfollow" : "follow"}`,
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
						borderBottomLeftRadius: 0,
						borderBottomRightRadius: 0,
						border: "none",
						background: pride
							? "linear-gradient(180deg, #f00000, #f00000 16.67%, #ff8000 16.67%, #ff8000 33.33%, #ffff00 33.33%, #ffff00 50%, #007940 50%, #007940 66.67%, #4040ff 66.67%, #4040ff 83.33%, #a000c0 83.33%, #a000c0)"
							: "var(--primary)"
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
						{props.requestedUser.username === "paul" ? (
							<sup>-</sup>
						) : props.requestedUser.plus ? (
							<sup>+</sup>
						) : (
							<></>
						)}
					</h1>

					<h2 className="username">
						@{props.requestedUser.username}{" "}
						<UserStatus
							id={props.requestedUser.id}
							style={{
								marginLeft: 2
							}}
						/>
					</h2>

					{props.requestedUser.followingUser ? (
						<div className="followsYou">Follows You</div>
					) : (
						<></>
					)}

					{self ? (
						<h2 className="counts">
							<Link href="/followers">
								<a>
									<span>
										<b>{props.requestedUser.followers}</b>{" "}
										{props.requestedUser.followers === 1
											? "Follower"
											: "Followers"}
									</span>
								</a>
							</Link>
							<span>
								<b>{props.requestedUser.rubies}</b>{" "}
								{props.requestedUser.rubies === 1 ? "Ruby" : "Rubies"}
							</span>
						</h2>
					) : (
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
					)}

					<h2 className="tagline">
						<Tags>{props.requestedUser.about}</Tags>
					</h2>

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
							? `--primary: #${props.requestedUser.color};`
							: ""}
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

					.followsYou {
						border: solid 1px var(--accents-2);
						border-radius: var(--radius);
						width: fit-content;
						padding: 5px 10px;
						color: var(--accents-6);
						font-size: 10px;
						margin: 10px auto;
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
		// Not Found
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
					`${process.env.NEXT_PUBLIC_APIURL}/users/${encodeURIComponent(
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
