import Page from "../layout/Page";
import withAuth from "../util/withAuth";

export default withAuth(props => (
  <Page header padding user={props.user}>
    <p>THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG.</p>
    <p>the quick brown fox jumped over the lazy dog.</p>
    <p>{[
        300, 400, 500, 700, 900
    ].map((w) => <span style={{fontWeight: w}}>{w} </span>)}</p>
  </Page>
));