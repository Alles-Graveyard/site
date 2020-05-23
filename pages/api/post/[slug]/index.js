import db from "../../../../util/db";
import sessionAuth from "../../../../util/sessionAuth";
import postData from "../../../../util/postData";
import config from "../../../../config";
import shortUuid from "short-uuid";
import {Op} from "sequelize";
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
	} catch (err) {
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
	let author = await post.getUser();
	author = author
		? {
				id: author.id,
				name: author.name,
				username: author.username,
				plus: author.plus
		  }
		: config.ghost;

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

	// Ancestors
	const ancestors = [];
	if (post.parentId) {
		let parent = await post.getParent();
		if (parent) {
			for (var i = 0; i < 15; i++) {
				ancestors.unshift(await postData(parent, user.id));
				if (!parent.parentId) {
					// No Parent
					break;
				}

				const childId = parent.id;
				parent = await parent.getParent();
				if (!parent) {
					// Missing Parent
					ancestors.push({
						slug: uuidTranslator.fromUUID(childId),
						removed: true
					});
					break;
				}
			}
		} else {
			ancestors.push({
				slug: uuidTranslator.fromUUID(post.parentId),
				removed: true
			});
		}
	}

	// Replies
	const replies = await Promise.all(
		(
			await post.getChildren({
				where: {
					userId: author.id
				},
				order: [["createdAt", "DESC"]],
				limit: 10
			})
		)
			.concat(
				await post.getChildren({
					where: {
						userId: {
							[Op.not]: author.id
						}
					},
					order: [["createdAt", "DESC"]],
					limit: 100
				})
			)
			.map(p => postData(p, user.id))
	);

	// Response
	res.json({
		slug: uuidTranslator.fromUUID(post.id),
		author,
		content: post.content,
		image: post.image ? `https://fs.alles.cx/${post.image}` : null,
		createdAt: post.createdAt,
		score: upvotes - downvotes,
		upvotes: author.id === user.id && user.plus ? upvotes : null,
		downvotes: author.id === user.id && user.plus ? downvotes : null,
		vote: vote ? ["down", "neutral", "up"].indexOf(vote.vote) - 1 : 0,
		replyCount: await post.countChildren(),
		replies,
		ancestors
	});
};
