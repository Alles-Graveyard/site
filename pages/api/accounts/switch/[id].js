import sessionAuth from "../../../../util/sessionAuth";

export default async (req, res) => {
	const {user, session} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});
	if (typeof req.query.id !== "string")
		return res.status(400).json({err: "invalidQueryParameters"});

	// Get Primary Account
	const primary = await user.getPrimary({
		attributes: ["id"]
	});

	// Get Secondary Accounts
	const secondaries = (
		await (primary ? primary : user).getSecondaries({
			attributes: ["id"]
		})
	).map(u => u.id);

	// Check ID is in connected accounts
	if (
		req.query.id !== (primary ? primary : user).id &&
		!secondaries.includes(req.query.id)
	)
		return res.status(400).json({err: "accountNotRelated"});

	// Update Session
	await session.update({
		userId: req.query.id
	});

	// Response
	res.json({});
};
