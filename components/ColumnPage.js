import Page from "./Page";

export default ({children, width, ...props}) => (
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
				max-width: ${width ? width : "100%"};
			}
		`}</style>
	</Page>
);
