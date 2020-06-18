import db from "../../../../util/db";

export default async (req, res) => {
	// Get Application
	if (typeof req.query.id !== "string")
		return res.status(400).json({err: "missingResource"});
	const application = await db.Application.findOne({
		where: {
			id: req.query.id
		}
	});
	if (!application) return res.status(400).json({err: "missingResource"});

	// Response
	res.json({
		id: application.id,
		name: application.name,
		description: application.description,
		firstParty: application.firstParty,
		createdAt: application.createdAt,
		callbackUrls: application.callbackUrls
	});
};
