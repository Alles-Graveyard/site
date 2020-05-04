import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import Link from "next/link";

export default withAuth(props => {
	return (
		<Page user={props.user}>
			<p>
				This page isn't done yet. Go to{" "}
				<Link href="/me">
					<a className="normal">your account page</a>
				</Link>{" "}
				to manage settings.
			</p>
		</Page>
	);
});
