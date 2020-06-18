import sessionAuth from "../../../util/sessionAuth";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Response
	res.json({
		sessions: (
			await user.getSessions({
				order: [["createdAt", "DESC"]]
			})
		).map(s => {
			return {
				id: s.id,
				address: s.address,
				createdAt: s.createdAt
			};
		})
	});
};
