import sessionAuth from "../../../util/sessionAuth";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});

	const teams = (
		await user.getTeams({
			order: ["name"]
		})
	).map(team => ({
		id: team.id,
		slug: team.slug,
		name: team.name
	}));

	res.json(teams);
};
