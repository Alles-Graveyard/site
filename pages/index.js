import Page from "../layout/Page";
import withAuth from "../util/withAuth";

export default withAuth(() => (
  <Page header padding>
    <p>test</p>
  </Page>
));