import Page from "../components/Page";
import withAuth from "../util/withAuth";

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
			<p>
				WARNING! THIS PAGE IS FOR DEBUGGING PURPOSES ONLY! DO NOT GIVE THIS
				INFORMATION TO <b>ANYONE</b>.
			</p>
			<p style={{whiteSpace: "pre-wrap", wordBreak: "break-all"}}>
				{JSON.stringify(props.user, null, "   ")}
			</p>
		</Page>
	);
});
