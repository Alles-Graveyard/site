import Page from "../components/Page";
import withAuth from "../util/withAuth";
import axios from "axios";
import {Box} from "@reactants/ui";
import {useState} from "react";
import WideUser from "../components/WideUser";
import Link from "next/link";

const page = props => {
	const [view, setView] = useState(0);

	return (
		<Page
			title={["Followers", "Following"][view]}
			user={props.user}
			breadcrumbs={[
				{
					name: ["Followers", "Following"][view]
				}
			]}
		>
			<Box
				style={{
					display: "flex",
					overflow: "hidden"
				}}
			>
				<div onClick={() => setView(0)}>
					<h1>
						<span>{props.followerCount}</span> Follower
						{props.followerCount === 1 ? "" : "s"}
					</h1>
				</div>
				<div onClick={() => setView(1)}>
					<h1>
						<span>{props.followingCount}</span> Following
					</h1>
				</div>

				<style jsx>{`
					div {
						flex-grow: 1;
						cursor: pointer;
						text-align: center;
						padding: 10px;
					}

					div:nth-child(${view + 1}) {
						border-bottom: solid 5px var(--primary);
					}

					h1 {
						margin: 0;
						font-size: 30px;
						font-weight: 400;
					}

					h1 span {
						font-weight: 600;
					}
				`}</style>
			</Box>

			{[
				() =>
					props.followers.map(u => (
						<Link href="/[username]" as={`/${u.username}`} key={u.id}>
							<a>
								<WideUser user={u} />
							</a>
						</Link>
					)),
				() =>
					props.following.map(u => (
						<Link href="/[username]" as={`/${u.username}`} key={u.id}>
							<a>
								<WideUser user={u} />
							</a>
						</Link>
					))
			][view]()}
		</Page>
	);
};

page.getInitialProps = async ctx => {
	return (
		await axios.get(`${process.env.NEXT_PUBLIC_APIURL}/followers`, {
			headers: {
				authorization: ctx.user.sessionToken
			}
		})
	).data;
};

export default withAuth(page);
