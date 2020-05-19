import Page from "../components/Page";
import withAuth from "../util/withAuth";
import {Box, Spacer} from "@reactants/ui";

export default withAuth(props => {
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
		</Page>
	);
}, true);
