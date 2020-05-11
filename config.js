const dev = process.env.NODE_ENV === "development";

export default {
	apiUrl: `${dev ? "http://localhost:3000" : "https://alles.cx"}/api`,
	dev,
	scopes: {},
	inputBounds: {
		name: {
			min: 1,
			max: 50
		},
		nickname: {
			min: 1,
			max: 50
		},
		about: {
			min: 1,
			max: 125
		},
		password: {
			min: 6,
			max: 128
		},
		role: {
			min: 3,
			max: 32
		}
	},
	usersResultLimit: 20,
	maxPostLength: 300,
	fileUploadUrl: "https://fs.alles.cx",
	domain: "alles.cx"
};
