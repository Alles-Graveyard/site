import axios from "axios";

// Request
export const request = async (method, url, data) =>
	(
		await axios({
			method,
			url: `http://localhost:8080/${url}`,
			auth: {
				username: process.env.NEXUS_ID,
				password: process.env.NEXUS_SECRET
			},
			data
		})
	).data;

// Get User
export const getUser = id => request("GET", `users/${encodeURIComponent(id)}`);
export const getUserId = async username =>
	(await request("GET", `username/${encodeURIComponent(username)}`)).id;

// Validate password
export const validatePassword = async (id, password) => {
	try {
		return (
			await request("POST", `users/${encodeURIComponent(id)}/password`, {
				password
			})
		).matches;
	} catch (err) {
		return false;
	}
};

// Create session
export const createSession = async (id, address) =>
	(await request("POST", `users/${encodeURIComponent(id)}/sessions`, {address}))
		.token;
export const getSessionFromToken = token =>
	request("GET", `sessions/token/${encodeURIComponent(token)}`);
