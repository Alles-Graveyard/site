import Page from "../components/Page";
import withAuth from "../util/withAuth";
import Link from "next/link";
import PostField from "../components/PostField";
import Post from "../components/Post";
import WideLink from "../components/WideLink";
import {Box, Spacer} from "@reactants/ui";
import axios from "axios";

const page = props => {
	return (
		<Page user={props.user}>
			<div className="top">
				<div className="main">
					<h1>
						Hey, {props.user.nickname}
						{props.user.plus ? <sup>+</sup> : <></>}
					</h1>

					<PostField
						placeholder="What's up?"
						sessionToken={props.user.sessionToken}
					/>
				</div>
				<Box
					style={{
						marginLeft: 20,
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
						<WideLink href="https://paper.alles.cx" basic>
							Paper
						</WideLink>
						<WideLink href="https://textbox.alles.cx" basic>
							Textbox
						</WideLink>
					</Box.Content>
				</Box>
			</div>

			{props.feed.map(p => (
				<React.Fragment key={`${p.type}-${p.slug}`}>
					<Spacer y={2} />

					<Post
						data={p}
						self={props.user.id === p.author.id}
						sessionToken={props.user.sessionToken}
					/>
				</React.Fragment>
			))}

			<p className="follow">
				Follow{" "}
				<Link href="/people">
					<a className="normal">people</a>
				</Link>{" "}
				to see their posts.
			</p>

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

				.follow {
					text-align: center;
					font-style: italic;
					color: var(--accents-6);
				}
			`}</style>
		</Page>
	);
};

page.getInitialProps = async ctx => {
	return {
		feed: (
			await axios.get(`${process.env.NEXT_PUBLIC_APIURL}/feed`, {
				headers: {
					authorization: ctx.user.sessionToken
				}
			})
		).data.feed
	};
};

export default withAuth(page);
