import Page from "../components/Page";
import withAuth from "../util/withAuth";
import {useState} from "react";
import {Button} from "@reactants/ui";

export default withAuth(props => {
	const [parseText, setParseText] = useState(
		`${
			props.user ? `@${props.user.username}, ` : ``
		} Enter some #text and see what happens...`
	);

	return (
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
	);
}, true);
