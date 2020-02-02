import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import theme from "../theme";

export default withAuth(props => {
  return (
    <Page header user={props.user}>
    </Page>
  );
});