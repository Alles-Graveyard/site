import Page from "../components/Page";

export default () => (
	<Page title="Error">
		<h1>Error</h1>
		<p>Something went wrong</p>

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
