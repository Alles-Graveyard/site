import Page from "./Page";

export default ({children, ...props}) => (
	<Page {...props}>
		<div className="container">
			<div className="column">{children}</div>
		</div>

		<style jsx>{`
			.container {
				display: flex;
				justify-content: center;
			}

			.column {
				width: 100%;
				max-width: 375px;
			}
		`}</style>
	</Page>
);
