export default {
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
		tag: {
			max: 64
		},
		post: {
			max: 500
		}
	},
	usersResultLimit: 20,
	fileUploadUrl: "https://fs.alles.cx",
	domain: "alles.cx",
	ghost: {
		id: "a0f1ae72-9c65-4170-ae39-f9b8132cf476",
		username: "ghost",
		name: "Ghost 👻",
		plus: false
	}
};
