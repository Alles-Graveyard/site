import Page from "./Page";

export default ({ logo, ...props }) => (
	<Page
		header
		style={{
			padding: "0px",
			display: "flex",
			flexFlow: "column"
		}}
		{...props}
	>
		<main>
			{logo ? <img src="/a00.png" className="allesLogo" /> : <></>}
			{props.children}
		</main>

		<style jsx>{`
			main {
				background: white;
				max-width: 400px;
				min-height: 500px;
				margin: auto;
				border-radius: 10px;
				box-sizing: border-box;
				padding: 30px;
				border: solid 1px #80808040;
			}

			@media screen and (max-height: 650px) {
				.container {
					display: block;
				}

				main {
					flex-grow: 1;
					border-radius: 0;
				}
			}

			@media screen and (max-width: 650px) {
				main {
					width: 100%;
					border-radius: 0;
				}
			}

			.allesLogo {
				height: 100px;
				width: 100px;
				margin: 0 auto;
				display: block;
			}
		`}</style>
	</Page>
);
