import Page from "../layout/Page";
import withAuth from "../util/withAuth";

const testPhrase = "The quick brown fox jumped over the lazy dog.";
const fontWeights = [300, 400, 500, 700, 900];

export default withAuth(props => (
  <Page header padding user={props.user}>
    <p>{testPhrase.toUpperCase()}</p>
    <p>{testPhrase.toLowerCase()}</p>
    <p>{fontWeights.map((w) => <span style={{fontWeight: w}}>{w} </span>)}</p>
  </Page>
));