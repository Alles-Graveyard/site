import Page from "../layout/Page";
const errors = {
	200: "Nothing went wrong: You found the error page!",
	404: "The page you were looking for doesn't exist!",
	500: "Something broke :("
};

const error = ({statusCode}) => (
	<Page header title={statusCode ? statusCode : "Error"}>
		<h1>{statusCode ? statusCode : "Error"}</h1>
		<div className="info">
			<p>
				{statusCode
					? errors[statusCode]
						? errors[statusCode]
						: "Something went wrong."
					: "An error occurred on the client"}
			</p>
		</div>

		<style jsx>{`
			h1 {
				background: #ffffff;
				padding: 20px 50px 0 50px;
				width: fit-content;
				border-radius: 9999px 9999px 0 0;
				margin: 50px auto 0 auto;
				text-align: center;
			}

			.info {
				background: #ffffff;
				padding: 50px;
				width: fit-content;
				max-width: 600px;
				margin: 0 auto;
				border-radius: 10px;
				text-align: center;
			}

			.info p {
				margin: 0;
			}

			@media screen and (max-width: 400px) {
				h1 {
					width: 100%;
					box-sizing: border-box;
					border-radius: 20px 20px 0 0;
					padding: 20px 0 0 0;
				}

				.info {
					width: 100%;
					box-sizing: border-box;
					border-radius: 0 0 10px 10px;
					padding: 20px 20px 50px 20px;
				}
			}
		`}</style>
	</Page>
);

error.getInitialProps = ({res, err}) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return {
		statusCode
	};
};

export default error;
