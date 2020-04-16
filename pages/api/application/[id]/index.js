import db from "../../../../util/db";

export default async (req, res) => {
	//Get Application
	const application = await db.Application.findOne({
		where: {
			id: req.query.id
		},
		include: ["team"]
	});
	if (!application) return res.status(400).json({err: "invalidApplication"});
	if (!application.team.developer)
		return res.status(400).json({err: "applicationDisabled"});

	//Response
	res.json({
		id: application.id,
		team: {
			id: application.team.id,
			name: application.team.name,
			slug: application.team.slug,
			verified: application.team.verified
		},
		name: application.name,
		description: application.description,
		firstParty: application.firstParty,
		createdAt: application.createdAt,
		callbackUrls: application.callbackUrls
	});
};
