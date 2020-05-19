import sessionAuth from "../../../util/sessionAuth";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});

	// Get Primary Account
	const primary = await user.getPrimary({
		attributes: ["id", "username", "name", "plus"]
	});

	// Get Secondary Accounts
	const secondaries = await (primary ? primary : user).getSecondaries({
		attributes: ["id", "username", "name", "plus"]
	});

	// Response
	res.json({
		primary: primary
			? primary
			: {
					id: user.id,
					username: user.username,
					name: user.name,
					plus: user.plus
			  },
		secondaries
	});
};
