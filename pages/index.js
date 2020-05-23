import Page from "../components/Page";
import withAuth from "../util/withAuth";
import Link from "next/link";
import PostField from "../components/PostField";
import Post from "../components/Post";
import WideLink from "../components/WideLink";
import {Box, Spacer} from "@reactants/ui";

export default withAuth(props => {
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
						<WideLink href="https://paper.alles.cx" basic>
							Paper
						</WideLink>
						<WideLink href="https://textbox.alles.cx" basic>
							Textbox
						</WideLink>
					</Box.Content>
				</Box>
			</div>

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
			`}</style>
		</Page>
	);
});
