import Page from "../layout/Page";
import withAuth from "../util/withAuth";

const oauthPage = props => {
    return (
        <Page header user={props.user} title="Authorize">
            <p>Auth Page</p>
        </Page>
    );
};

export default withAuth(oauthPage);