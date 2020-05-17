import db from "./db";
import config from "../config";
import shortUuid from "short-uuid";
const uuidTranslator = shortUuid();

export default async (post, userId) => {
	// Get Vote
	const vote = userId
		? await db.PostInteraction.findOne({
				where: {
					postId: post.id,
					userId
				}
		  })
		: null;

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

	// Get Author
	const author = await post.getUser();

	// Return
	return {
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
		vote: vote ? ["down", "neutral", "up"].indexOf(vote.vote) - 1 : 0,
		replyCount: await post.countChildren()
	};
};
