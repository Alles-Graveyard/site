import Page from "../components/Page";
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
					: "Something went wrong."}
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
				text-align: center;
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
