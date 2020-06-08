import Page from "../../components/Page";
import withAuth from "../../util/withAuth";
import axios from "axios";
import {Box, Spacer} from "@reactants/ui";
import Link from "next/link";

const page = props => {
	return (
		<Page
			title="Developer"
			user={props.user}
			breadcrumbs={[
				{
					name: "Developer"
				}
			]}
		>
			{props.orgs.length > 0 ? (
				props.orgs.map(org => (
					<React.Fragment key={org.id}>
						<Spacer y={2} />

						<Link href="/dev/org/[id]" as={`/dev/org/${org.id}`}>
							<a className="org">
								<Box>
									<Box.Content
										style={{
											display: "flex"
										}}
									>
										<div
											className="circle"
											style={{
												backgroundColor: `#${org.color}`
											}}
										></div>
										<h1>{org.name}</h1>
									</Box.Content>
								</Box>
							</a>
						</Link>
					</React.Fragment>
				))
			) : (
				<p
					style={{
						textAlign: "center"
					}}
				>
					You're not in any orgs just yet!
				</p>
			)}

			<style jsx>{`
				.circle {
					height: 30px;
					width: 30px;
					border-radius: 50%;
					margin: auto 0;
					margin-right: 20px;
				}

				.org h1 {
					margin: 0;
					font-weight: 500;
					font-size: 30px;
				}
			`}</style>
		</Page>
	);
};

page.getInitialProps = async ctx => {
	return (
		await axios.get(`${process.env.NEXT_PUBLIC_APIURL}/devOrgs`, {
			headers: {
				authorization: ctx.user.sessionToken
			}
		})
	).data;
};

export default withAuth(page);
