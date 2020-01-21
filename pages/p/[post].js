import Page from "../../layout/Page";
import withAuth from "../../util/withAuth";
import Post from "../../components/Post";

export default withAuth(props => {
  return (
    <Page header padding centerContainer user={props.user}>
        <Post detailed data={{
            id: "000000",
            author: {
                name: "Archie Baer",
                username: "archie"
            },
            content: "This is an example post!",
            date: new Date(),
            liked: true,
            boosted: false
        }} />
    </Page>
  );
});