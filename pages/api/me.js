import sessionAuth from "../../util/sessionAuth";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});

	const primary = await user.getPrimary();
	res.json({
		id: user.id,
		username: user.username,
		name: user.name,
		nickname: user.nickname,
		about: user.about,
		private: user.private,
		plus: user.plus,
		rubies: user.rubies,
		createdAt: user.createdAt,
		primary: primary
			? {
					id: primary.id,
					username: primary.username,
					name: primary.name
			  }
			: null
	});
};
