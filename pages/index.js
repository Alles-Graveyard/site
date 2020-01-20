import Page from "../layout/Page";
import withAuth from "../util/withAuth";

export default withAuth(props => (
  <Page header padding user={props.user}>
    <p>THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG.</p>
  </Page>
));