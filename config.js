export default {
	scopes: {
		primary: "View basic information about your primary account"
	},
	inputBounds: {
		name: {
			min: 1,
			max: 50
		},
		nickname: {
			min: 1,
			max: 50
		},
		username: {
			min: 3,
			max: 16
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
		},
		email: {
			max: 100
		}
	},
	fileUploadUrl: "https://fs.alles.cx",
	domain: "alles.cx",
	ghost: {
		id: "a0f1ae72-9c65-4170-ae39-f9b8132cf476",
		username: "ghost",
		name: "Ghost 👻",
		plus: false
	},
	imageSize: 5 * 1024 * 1024,
	maxFollows: 1000
};
