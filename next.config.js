const {ORIGIN, MODE} = process.env;

module.exports = {
	env: {
		apiUrl: `${
			ORIGIN
				? ORIGIN
				: MODE === "beta"
				? "https://beta.alles.cx"
				: "https://alles.cx"
		}/api`,
		mode: MODE ? MODE : "stable"
	}
};
