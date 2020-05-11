import Page from "../components/Page";
import Link from "next/link";
import Cat from "../confused-cat";

export default () => (
	<Page title="Page not found">
		<h1>Page not found</h1>
		<p>
			Hmm... there's nothing here. You could go back to the{" "}
			<Link href="/">
				<a className="normal">homepage</a>
			</Link>
			, or{" "}
			<a href="https://veev.cc" className="normal">
				search the web
			</a>
			.
		</p>
		<Cat />

		<style jsx>{`
			h1 {
				margin: 0;
				margin-bottom: 20px;
				text-align: center;
			}

			p {
				margin: 0;
				text-align: center;
			}
		`}</style>
	</Page>
);
