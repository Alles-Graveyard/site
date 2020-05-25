import Page from "../components/Page";
import withAuth from "../util/withAuth";
import Link from "next/link";
import PostField from "../components/PostField";
import Post from "../components/Post";
import WideLink from "../components/WideLink";
import {Box, Spacer} from "@reactants/ui";
import {useState, useEffect} from "react";
import axios from "axios";
import {Settings, User, AtSign, Users} from "react-feather";

const page = props => {
	const [feed, setFeed] = useState();

	useEffect(() => {
		const updateFeed = async () => {
			try {
				setFeed(
					(
						await axios.get(`${process.env.NEXT_PUBLIC_APIURL}/feed`, {
							headers: {
								authorization: props.user.sessionToken
							}
						})
					).data.feed
				);
			} catch (err) {}
		};

		updateFeed();
		const interval = setInterval(updateFeed, 30000);
		return () => clearInterval(interval);
	}, []);

	const iconButtonStyle = {
		margin: "0 auto"
	};

	return (
		<Page user={props.user}>
			<div className="top">
				<div className="main">
					<h1>
						Hey, {props.user.nickname}
						{props.user.plus ? <sup>+</sup> : <></>}
					</h1>

					<div className="iconRow">
						<Link href="/me">
							<a>
								<Settings style={iconButtonStyle} />
							</a>
						</Link>

						<Link href="/[username]" as={`/${props.user.username}`}>
							<a>
								<User style={iconButtonStyle} />
							</a>
						</Link>

						<Link href="/mentions">
							<a>
								<AtSign style={iconButtonStyle} />
							</a>
						</Link>

						<Link href="/accounts">
							<a>
								<Users style={iconButtonStyle} />
							</a>
						</Link>
					</div>

					<PostField
						placeholder="What's up?"
						sessionToken={props.user.sessionToken}
					/>
				</div>

				<div className="sidebar">
					<Spacer x={2} />

					<Box
						style={{
							width: 250,
							flexShrink: 0
						}}
					>
						<Box.Content>
							<WideLink href="/me">My Account</WideLink>
							<WideLink href="/[username]" as={`/${props.user.username}`}>
								Profile Page
							</WideLink>
							<WideLink href="/mentions">Mentions</WideLink>
							<WideLink href="/accounts">Switch Accounts</WideLink>
						</Box.Content>
					</Box>
				</div>
			</div>

			{feed ? (
				feed.length > 0 ? (
					feed.map(p => (
						<React.Fragment key={`${p.type}-${p.slug}`}>
							<Spacer y={2} />

							<Post
								data={p}
								self={props.user.id === p.author.id}
								sessionToken={props.user.sessionToken}
							/>
						</React.Fragment>
					))
				) : (
					<p className="feedText">
						Follow{" "}
						<Link href="/people">
							<a className="normal">people</a>
						</Link>{" "}
						to see their posts.
					</p>
				)
			) : (
				<p className="feedText">Loading your feed...</p>
			)}

			<style jsx>{`
				.top {
					display: flex;
					width: 100%;
				}

				.top .main {
					flex-grow: 1;
				}

				h1 {
					font-size: 30px;
					margin-bottom: 20px;
				}

				.iconRow {
					margin-bottom: 20px;
					display: flex;
					flex-wrap: wrap;
				}

				.iconRow a {
					background: var(--surface);
					border: solid 1px var(--accents-2);
					border-radius: 50%;
					padding: 10px;
					border-radius: 50%;
					width: 50px;
					height: 50px;
					flex-shrink: 0;
					display: flex;
					flex-flow: column;
					justify-content: center;
					margin: 10px;
				}

				.sidebar {
					display: none;
				}

				@media screen and (min-width: 840px) {
					.iconRow {
						display: none;
					}

					.sidebar {
						display: flex;
					}
				}

				.feedText {
					text-align: center;
					font-style: italic;
					color: var(--accents-6);
					margin-top: 50px;
				}
			`}</style>
		</Page>
	);
};

export default withAuth(page);
