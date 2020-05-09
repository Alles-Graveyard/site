import sessionAuth from "../../util/sessionAuth";
import conf from "../../config";
import credentials from "../../credentials";
import formidable from "formidable";
import sharp from "sharp";
import axios from "axios";
import {literal} from "sequelize";
import FormData from "form-data";

export default async (req, res) => {
	const {user} = await sessionAuth(req.headers.authorization);
	if (!user) return res.status(401).json({err: "invalidSession"});

	try {
		// Parse Form
		const file = await parseForm(req);
		if (!file.avatar) return res.status(400).json({err: "badRequest"});

		try {
			// Decrease Reputation
			await user.update({
				reputation: literal("reputation - 1")
			});

			// Manipulate Image
			const img = await sharp(file.avatar.path)
				.resize(500, 500)
				.flatten({
					background: {
						r: 255,
						g: 255,
						b: 255
					}
				})
				.png()
				.toBuffer();

			// Upload to AllesFS
			const formData = new FormData();
			formData.append("file", img, {
				filename: "image"
			});
			formData.append("public", "true");
			const id = (
				await axios.post(conf.fileUploadUrl, formData.getBuffer(), {
					auth: credentials.fileUpload,
					headers: formData.getHeaders()
				})
			).data;

			// Set File ID in Database
			await user.update({
				avatar: id
			});

			res.json({});
		} catch (e) {
			res.status(500).json({err: "internalError"});
		}
	} catch (e) {
		res.status(400).json({err: "badRequest"});
	}
};

const parseForm = req =>
	new Promise((resolve, reject) => {
		const form = formidable({
			maxFileSize: 5 * 1024 * 1024
		});

		form.parse(req, async (err, fields, file) => {
			if (err || !file) return reject();
			resolve(file);
		});
	});

export const config = {
	api: {
		bodyParser: false
	}
};
