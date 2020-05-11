import Page from "../layout/Page";
const errors = {
	200: "Nothing went wrong: You found the error page!",
	404: "The page you were looking for doesn't exist!",
	500: "Something broke :("
};

const page = ({statusCode}) => (
	<Page title={statusCode ? statusCode : "Error"}>
		<main>
			<h1>{statusCode ? statusCode : "Error"}</h1>
			<p>
				{statusCode
					? errors[statusCode]
						? errors[statusCode]
						: "Something went wrong."
					: "An error occurred on the client"}
			</p>
		</main>

		<style jsx>{`
			h1 {
				margin: 0;
				margin-bottom: 20px;
			}

			p {
				margin: 0;
			}

			main {
				background: #ffffff;
				text-align: center;
				padding: 50px;
				width: 100%;
				max-width: 300px;
				margin: 0 auto;
				border-radius: 10px;
				border: solid 1px var(--accent-2);
			}
		`}</style>
	</Page>
);

page.getInitialProps = ({res, err}) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return {
		statusCode
	};
};

export default page;
