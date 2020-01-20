import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import {useState} from "react";

export default withAuth(props => {
  const [h] = useState(new Date().getHours());

  return (
    <Page header padding user={props.user}>
      <h1>Good {h < 3 ? "Night" : h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening"}, Archie!</h1>
    </Page>
  );
});