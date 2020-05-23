import Page from "../components/Page";
import withAuth from "../util/withAuth";
import {Box, Spacer, Input} from "@reactants/ui";
import Tags from "../components/Tags";
import {useState} from "react";

export default withAuth(props => {
	const [parseText, setParseText] = useState(
		`${
			props.user ? `@${props.user.username}, ` : ``
		} Enter some #text and see what happens...`
	);

	return (
		<Page
			user={props.user}
			breadcrumbs={[
				{
					name: "Debug"
				}
			]}
		>
			<Box>
				<Box.Header>Env Vars</Box.Header>
				<Box.Content>
					<p>API Url: {process.env.NEXT_PUBLIC_APIURL}</p>
					<p>Mode: {process.env.NEXT_PUBLIC_MODE}</p>
				</Box.Content>
			</Box>

			{props.user ? (
				<>
					<Spacer y={2} />

					<Box>
						<Box.Header>User Data</Box.Header>
						<Box.Content>
							<p style={{whiteSpace: "pre-wrap", wordBreak: "break-all"}}>
								{JSON.stringify(props.user, null, "   ")}
							</p>
						</Box.Content>
						<Box.Footer>
							This information is extremely sensitive. Do not give it to{" "}
							<strong>ANYONE</strong>.
						</Box.Footer>
					</Box>
				</>
			) : (
				<></>
			)}

			<Spacer y={2} />

			<Box
				style={{
					minHeight: 200
				}}
			>
				<Box.Header>Content Parsing</Box.Header>
				<Box.Content>
					<Input onChange={e => setParseText(e.target.value)} fluid />
					<p>
						<Tags>{parseText.trim()}</Tags>
					</p>
				</Box.Content>
			</Box>
		</Page>
	);
}, true);
