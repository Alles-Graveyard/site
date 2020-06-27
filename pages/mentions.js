import Page from "../components/Page";
import withAuth from "../util/withAuth";
import axios from "axios";
import Post from "../components/Post";
import {Spacer} from "@reactants/ui";

const page = props => {
	return (
		<Page
			title="Mentions and Replies"
			user={props.user}
			breadcrumbs={[
				{
					name: "Mentions and Replies"
				}
			]}
		>
			{props.mentions.length > 0 ? (
				props.mentions.map(p => (
					<React.Fragment key={p.slug}>
						<Spacer y={2} />

						<Post
							data={p}
							self={props.user.id === p.author.id}
							sessionToken={props.user.sessionToken}
						/>
					</React.Fragment>
				))
			) : (
				<p
					style={{
						textAlign: "center"
					}}
				>
					No recent mentions.
				</p>
			)}
		</Page>
	);
};

page.getInitialProps = async ctx => {
	return (
		await axios.get(`${process.env.NEXT_PUBLIC_APIURL}/mentions?mark=read`, {
			headers: {
				authorization: ctx.user.sessionToken
			}
		})
	).data;
};

export default withAuth(page);
