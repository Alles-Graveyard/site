import db from "../../../../../../util/db";
import sessionAuth from "../../../../../../util/sessionAuth";

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

	//Get User
	if (typeof req.query.username !== "string")
		return res.status(400).json({err: "invalidUser"});
	const u = await db.User.findOne({
		where: {
			username: req.query.username
		}
	});
	if (!u) return res.status(400).json({err: "invalidUser"});

	//Get Team Member
	const m = await db.TeamMember.findOne({
		where: {
			userId: u.id,
			teamId: team.id
		}
	});
	if (!m) return res.status(400).json({err: "notMemberOfTeam"});
	if (m.admin || (m.roles.includes("manage-members") && !teamMember.admin))
		return res.status(400).json({err: "cannotRemove"});

	//Remove
	await m.destroy();
	res.json({});
};
