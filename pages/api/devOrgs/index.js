import sessionAuth from "../../../util/sessionAuth";
import db from "../../../util/db";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});

	// Get Memberships
	const memberships = await db.DevOrgMember.findAll({
		where: {
			userId: user.id,
			accepted: true
		},
		order: ["createdAt"]
	});

	// Response
	res.json({
		orgs: await Promise.all(
			memberships.map(async m => {
				const org = await db.DevOrg.findOne({
					where: {
						id: m.orgId
					}
				});

				return {
					id: org.id,
					name: org.name,
					color: org.color
				};
			})
		)
	});
};
