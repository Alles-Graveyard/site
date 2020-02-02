import Page from "../layout/Page";
import withAuth from "../util/withAuth";

export default withAuth(props => {
  return (
    <Page header user={props.user}>
        <p>WARNING! THIS PAGE IS FOR DEBUGGING PURPOSES ONLY! DO NOT GIVE THIS INFORMATION TO <b>ANYONE</b>.</p>
        <p style={{whiteSpace: "pre-wrap"}}>{JSON.stringify(props.user, null, "   ")}</p>
    </Page>
  );
});