const dev = process.env.NODE_ENV === "development";

export default {
	apiUrl: `${dev ? "http://localhost" : "https://alles.cx"}/api/v1`,
	dev,
	scopes: {
		teams: "Know what teams you are in"
	},
	inputBounds: {
		auTransactionAmount: {
			min: 10,
			max: 1000000
		}
	}
};
