import Page from "../../components/Page";
import withAuth from "../../util/withAuth";
import config from "../../config";
import axios from "axios";
import {withRouter} from "next/router";
import {useState} from "react";
import {Button, Box, Spacer} from "@reactants/ui";
import Post from "../../components/Post";
import PostField from "../../components/PostField";
import NotFound from "../404";

const page = props => {
	if (props.post) {
		return (
			<Page
				title={`@${props.post.author.username}`}
				user={props.user}
				breadcrumbs={[
					{
						name: `@${props.post.author.username}`,
						href: "/[username]",
						as: `/${props.post.author.username}`
					}
				]}
			>
				<Post
					data={props.post}
					sessionToken={props.user.sessionToken}
					expanded
				/>

				<Spacer y={2} />

				<PostField
					placeholder={
						props.user.id !== props.post.author.id
							? `Reply to @${props.post.author.username}`
							: "Got something else to say?"
					}
					button="Reply"
					sessionToken={props.user.sessionToken}
				/>
			</Page>
		);
	} else {
		//User does not exist
		return <NotFound />;
	}
};

page.getInitialProps = async ctx => {
	const {slug} = ctx.query;
	const {sessionToken} = ctx.user;

	try {
		return {
			post: (
				await axios.get(
					`${config.apiUrl}/post/${encodeURIComponent(slug)}?children`,
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
