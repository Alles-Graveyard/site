import Page from "../layout/CardPage";
import {useState} from "react";
import router, {withRouter} from "next/router";
import Cookies from "js-cookie";
import config from "../config";
import axios from "axios";

import Input from "../components/Input";
import Button from "../components/Button";
import SmallText from "../components/SmallText";
import theme from "../theme";

export default withRouter(props => {
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  
  return (
    <Page title="Log in" logo>
      <h1>Sign in to Alles</h1>
      <form onSubmit={e => {
        e.preventDefault();
        setFormError("");
        const username = e.target.username.value;
        const password = e.target.password.value;
        if (!username || !password || formLoading) return;
        setFormLoading(true);
        axios.post(`${config.apiUrl}/login`, {
          username,
          password
        }).then(res => {
          Cookies.set("sessionToken", res.data.token);
          const redirectUrl = props.router.query.redirect;
          router.push(redirectUrl ? redirectUrl : "/");
        }).catch(err => {
          if (err.response && err.response.status === 401) {
            setFormError("Your username or password is incorrect.");
            setFormLoading(false);
          } else {
            setFormError("Something went wrong.");
            setFormLoading(false);
          }
        });
      }}>
        <Input wide name="username" placeholder="Username" />
        <Input wide name="password" placeholder="Password" type="password" />
        <Button disabled={formLoading} wide>Sign in</Button>
      </form>
      <SmallText>Come and talk to us in <a href="https://discord.gg/6Z27nuh" className="nocolor">our discord server</a> to learn more about Alles. We use cookies to keep you signed in.</SmallText>
      {formError ? <p style={{color: theme.error}}>{formError}</p> : <></>}
    </Page>
  );
});