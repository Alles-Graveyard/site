import db from "../../../../util/db";
import sessionAuth from "../../../../util/sessionAuth";
import shortUuid from "short-uuid";
const uuidTranslator = shortUuid();

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});
	if (typeof req.query.slug !== "string")
		return res.status(400).json({err: "badRequest"});

	// Get Post
	const post = await db.Post.findOne({
		where: {
			id: uuidTranslator.toUUID(req.query.slug)
		},
		include: ["user"]
	});
	if (!post) return res.status(400).json({err: "invalidPost"});

	// Get Vote
	const vote = await db.PostInteraction.findOne({
		where: {
			postId: post.id,
			userId: user.id
		}
	});

	// Get Upvotes
	const upvotes = await db.PostInteraction.count({
		where: {
			postId: post.id,
			vote: "up"
		}
	});

	// Get Upvotes
	const downvotes = await db.PostInteraction.count({
		where: {
			postId: post.id,
			vote: "down"
		}
	});

	// Response
	res.json({
		slug: uuidTranslator.fromUUID(post.id),
		author: {
			id: post.user.id,
			name: post.user.name,
			username: post.user.username,
			plus: post.user.plus
		},
		content: post.content,
		image: post.image ? `https://fs.alles.cx/${post.image}` : null,
		createdAt: post.createdAt,
		score: upvotes - downvotes,
		upvotes: post.user.id === user.id && user.plus ? upvotes : null,
		downvotes: post.user.id === user.id && user.plus ? downvotes : null,
		vote: vote ? ["down", "neutral", "up"].indexOf(vote.vote) - 1 : 0,
		replyCount: await post.countChildren()
	});
};
