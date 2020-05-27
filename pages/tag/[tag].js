import Page from "../../components/Page";
import withAuth from "../../util/withAuth";
import axios from "axios";
import {withRouter} from "next/router";
import {Box, Spacer} from "@reactants/ui";
import Post from "../../components/Post";
import PostField from "../../components/PostField";
import NotFound from "../404";

const page = props => (
	<Page
		title={`#${props.tag.name}`}
		user={props.user}
		breadcrumbs={[
			{
				name: `#${props.tag.name}`
			}
		]}
	>
		{props.tag.image || props.tag.description || props.tag.url ? (
			<>
				<Box>
					<Box.Content>
						{props.tag.image ? <img src={props.tag.image} /> : <></>}
						<h1>{props.tag.title}</h1>
						{props.tag.description ? <p>{props.tag.description}</p> : <></>}
						{props.tag.url ? (
							<p className="url">
								<a className="normal" href={props.tag.url}>
									{props.tag.url}
								</a>
							</p>
						) : (
							<></>
						)}

						<style jsx>{`
							img {
								width: 100%;
								border-radius: var(--radius);
							}

							h1 {
								font-size: 30px;
								margin: 10px 0;
							}

							p {
								font-size: 15px;
								margin: 10px 0;
							}

							.url {
								margin-top: 20px;
							}
						`}</style>
					</Box.Content>
				</Box>

				<Spacer y={2} />
			</>
		) : (
			<></>
		)}

		<PostField
			placeholder={`${
				props.tag.posts.length > 0 ? "Join in with" : "Start"
			} the conversation by using the tag #${props.tag.name}`}
			sessionToken={props.user.sessionToken}
		/>

		{props.tag.posts.map(p => (
			<React.Fragment key={p.slug}>
				<Spacer y={2} />

				<Post
					data={p}
					self={props.user.id === p.author.id}
					sessionToken={props.user.sessionToken}
				/>
			</React.Fragment>
		))}
	</Page>
);

page.getInitialProps = async ctx => {
	const {tag} = ctx.query;
	const {sessionToken} = ctx.user;

	return {
		tag: (
			await axios.get(
				`${process.env.NEXT_PUBLIC_APIURL}/tag/${encodeURIComponent(tag)}`,
				{
					headers: {
						authorization: sessionToken
					}
				}
			)
		).data
	};
};

export default withAuth(withRouter(page));
