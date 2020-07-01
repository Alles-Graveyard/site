import axios from "axios";

// Request
export const request = async (method, url) =>
	(
		await axios({
			method,
			url: `http://localhost:8080/${url}`,
			auth: {
				username: process.env.NEXUS_ID,
				password: process.env.NEXUS_SECRET
			}
		})
	).data;

// Get User
export const getUserById = id =>
	request("GET", `user?id=${encodeURIComponent(id)}`);
export const getUserByUsername = username =>
	request("GET", `user?username=${encodeURIComponent(username)}`);
