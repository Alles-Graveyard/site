import Page from "../components/Page";
import withAuth from "../util/withAuth";
import {Button} from "@reactants/ui";

export default withAuth(
	props => (
		<Page user={props.user}>
			<h1>Coming soon!</h1>
			<p>We haven't finished this part just yet!</p>
			<Button
				primary
				style={{
					margin: "20px auto"
				}}
				onClick={() => window.history.back()}
			>
				Go back
			</Button>

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
	),
	true
);
