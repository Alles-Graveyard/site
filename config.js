const dev = process.env.NODE_ENV === "development";

export default {
	apiUrl: `${dev ? "http://localhost" : "https://alles.cx"}/api/v1`,
	dev,
	scopes: {
		"basic-profile": "View basic profile information",
		"team-list": "Know what teams you are in"
	}
};
