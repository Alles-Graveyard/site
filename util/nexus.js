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
export const getUserById = id =>
	request("GET", `user?id=${encodeURIComponent(id)}`);
export const getUserByUsername = username =>
	request("GET", `user?username=${encodeURIComponent(username)}`);

// Validate password
export const validatePassword = async (id, password) => {
	try {
		return (
			await request("POST", `user/${encodeURIComponent(id)}/password`, {
				password
			})
		).matches;
	} catch (err) {
		return false;
	}
};
