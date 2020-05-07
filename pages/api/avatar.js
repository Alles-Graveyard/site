import sessionAuth from "../../util/sessionAuth";
import formidable from "formidable";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});

	const form = formidable();
	form.parse(req, (err, fields, file) => {
		console.log("test");
		if (err || !file) return res.status(400).json({err: "badRequest"});
		console.log(file);
		res.json({});
	});
};

export const config = {
	api: {
		bodyParser: false
	}
};
