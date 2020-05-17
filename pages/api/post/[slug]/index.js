import db from "../../../../util/db";
import sessionAuth from "../../../../util/sessionAuth";
import postData from "../../../../util/postData";
import config from "../../../../config";
import shortUuid from "short-uuid";
const uuidTranslator = shortUuid();

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});
	if (typeof req.query.slug !== "string")
		return res.status(400).json({err: "badRequest"});

	// Post ID
	let id;
	try {
		id = uuidTranslator.toUUID(req.query.slug);
	} catch (e) {
		return res.status(400).json({err: "invalidPost"});
	}

	// Get Post
	const post = await db.Post.findOne({
		where: {
			id
		}
	});
	if (!post) return res.status(400).json({err: "invalidPost"});

	// Get Author
	const author = await post.getUser();

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

	// Get Downvotes
	const downvotes = await db.PostInteraction.count({
		where: {
			postId: post.id,
			vote: "down"
		}
	});

	// Parent
	let parent = await post.getParent();
	if (post.parentId && !parent) {
		// Missing Post
		parent = config.ghost.post;
	} else if (parent) parent = await postData(parent);

	// Response
	res.json({
		slug: uuidTranslator.fromUUID(post.id),
		author: author
			? {
					id: author.id,
					name: author.name,
					username: author.username,
					plus: author.plus
			  }
			: config.ghost.user,
		content: post.content,
		image: post.image ? `https://fs.alles.cx/${post.image}` : null,
		createdAt: post.createdAt,
		score: upvotes - downvotes,
		upvotes: author && author.id === user.id && user.plus ? upvotes : null,
		downvotes: author && author.id === user.id && user.plus ? downvotes : null,
		vote: vote ? ["down", "neutral", "up"].indexOf(vote.vote) - 1 : 0,
		replyCount: await post.countChildren(),
		parent
	});
};
