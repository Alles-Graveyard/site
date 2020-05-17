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
	domain: "alles.cx",
	ghost: {
		user: {
			id: "a0f1ae72-9c65-4170-ae39-f9b8132cf476",
			username: "ghost",
			name: "Ghost 👻",
			plus: false
		},
		post: {
			slug: "missing",
			author: {
				id: "a0f1ae72-9c65-4170-ae39-f9b8132cf476",
				username: "ghost",
				name: "Ghost 👻",
				plus: false
			},
			content: "This post is missing :/",
			image: null,
			createdAt: new Date(1592006400000),
			score: 0,
			vote: 0,
			replyCount: 1
		}
	}
};
