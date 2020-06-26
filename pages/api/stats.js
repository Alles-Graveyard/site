import db from "../../util/db";
let stats;

// Update Stats
const getStats = async () => {
	const data = {
		updated: new Date().getTime(),
		accounts: {
			total: await db.User.count(),
			plus: await db.User.count({where: {plus: true}}),
			primary: await db.User.count({where: {primaryId: null}})
		},
		posts: {
			total: await db.Post.count()
		},
		follows: await db.FollowerRelation.count(),
		interactions: {
			total: await db.PostInteraction.count(),
			up: await db.PostInteraction.count({where: {vote: "up"}}),
			down: await db.PostInteraction.count({where: {vote: "down"}})
		}
	};

	data.accounts.secondary = data.accounts.total - data.accounts.primary;
	data.posts.average = Math.round(data.posts.total / data.accounts.total);
	data.interactions.neutral =
		data.interactions.total - data.interactions.up - data.interactions.down;

	return data;
};

// Interval
setInterval(async () => (stats = await getStats()), 60000);

// Response
export default async (req, res) => {
	if (!stats) stats = await getStats();
	res.json(stats);
};
