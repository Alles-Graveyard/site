import axios from "axios";

export default (method, url) => axios({
    method,
    url: `http://localhost:8080/${url}`,
    auth: {
        username: process.env.NEXUS_ID,
        password: process.env.NEXUS_SECRET
    }
});