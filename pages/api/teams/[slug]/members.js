import db from "../../../../util/db";
import sessionAuth from "../../../../util/sessionAuth";

export default async (req, res) => {
    const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});
	
	//Get Team
	const team = await db.Team.findOne({
		where: {
			slug: req.query.slug
		}
	});
	if (!team) return res.status(400).json({err: "invalidTeam"});

	//Get Team Member
	const teamMember = await db.TeamMember.findOne({
		where: {
			userId: user.id,
			teamId: team.id
		}
	});
	if (!teamMember) return res.status(400).json({err: "notMemberOfTeam"});
	if (!teamMember.admin && !teamMember.includes("manage-members"))
		return res.status(400).json({err: "badPermissions"});

	//Get Team Members
	const members = await team.getMembers();

	res.json({
		id: team.id,
		name: team.name,
		slug: team.slug,
		members: await Promise.all(
			members.map(async u => {
				const m = await db.TeamMember.findOne({
					where: {
						userId: u.id,
						teamId: team.id
					}
				});

				return {
					id: u.id,
					name: u.name,
					username: u.username,
					admin: m.admin,
					roles: m.roles
				};
			})
		)
	});
};
