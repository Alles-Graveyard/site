import axios from "axios";
import config from "../config";
import {useState} from "react";
import Cookies from "js-cookie";
import router, {withRouter} from "next/router";

const LoginForm = props => {
    const [formData, setFormData] = useState({username: "", password: ""});
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            axios.post(`${config.apiUrl}/login`, {
                username: formData.username,
                password: formData.password
            }).then((res) => {
                Cookies.set("sessionToken", res.data.token);
                const redirectUrl = props.router.query.redirect;
                router.push(redirectUrl ? redirectUrl : "/");
            }).catch((err) => {
                console.log(err);
            });
        }}>
            <input onChange={(e) => {
                setFormData({...formData, username: e.target.value.trim().toLowerCase()});
            }} placeholder="Username" />
            <input onChange={(e) => {
                setFormData({...formData, password: e.target.value});
            }} placeholder="Password" type="password" />
            <button>Sign in</button>
        </form>
    );
};

export default withRouter(LoginForm);