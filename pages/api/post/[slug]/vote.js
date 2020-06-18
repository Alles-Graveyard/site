import db from "../../../../util/db";
import sessionAuth from "../../../../util/sessionAuth";
import shortUuid from "short-uuid";
const uuidTranslator = shortUuid();

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "badAuthorization"});
	if (
		typeof req.query.slug !== "string" ||
		!req.body ||
		typeof req.body.vote !== "number" ||
		![-1, 0, 1].includes(req.body.vote)
	)
		return res.status(400).json({err: "badRequest"});

	// Post ID
	let id;
	try {
		id = uuidTranslator.toUUID(req.query.slug);
	} catch (err) {
		return res.status(400).json({err: "missingResource"});
	}

	// Get Post
	const post = await db.Post.findOne({
		where: {
			id
		}
	});
	if (!post) return res.status(400).json({err: "missingResource"});

	// Get Interaction
	let interaction = await db.PostInteraction.findOne({
		where: {
			postId: post.id,
			userId: user.id
		}
	});
	if (interaction) {
		// Update Interaction
		await interaction.update({
			vote: ["down", "neutral", "up"][req.body.vote + 1]
		});
	} else {
		// Create Interaction
		interaction = await db.PostInteraction.create({
			postId: post.id,
			userId: user.id,
			vote: ["down", "neutral", "up"][req.body.vote + 1]
		});
	}

	// Response
	res.json({});
};
