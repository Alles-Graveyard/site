import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import Post from "../components/Post";
import axios from "axios";
import config from "../config";

const feedPage = props => {
  return (
    <Page header padding centerContainer user={props.user}>
      {props.feed.map((p) => (
        <Post key={p.id} data={p} />
      ))}
    </Page>
  );
};

feedPage.getInitialProps = async ctx => {
  var apiReq;
  try {
      apiReq = await axios.get(`${config.apiUrl}/feed`, {
          headers: {
              authorization: ctx.user.sessionToken
          }
      });
  } catch (err) {
      return {feed: []};
  }
  
  return {
      feed: apiReq.data
  };
};

export default withAuth(feedPage);