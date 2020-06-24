import db from "../../util/db";
let stats = {};

// Update Stats
const updateStats = async () => {
	stats = {
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

	stats.accounts.secondary = stats.accounts.total - stats.accounts.primary;
	stats.posts.average = Math.round(stats.posts.total / stats.accounts.total);
	stats.interactions.neutral =
		stats.interactions.total - stats.interactions.up - stats.interactions.down;
};
updateStats();
setInterval(updateStats, 60000);

// Response
export default (req, res) => res.json(stats);
