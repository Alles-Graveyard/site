export default text => {
	const segments = [];

	let segment = {
		type: "text",
		string: ""
	};

	for (let i = 0; i < text.length; i++) {
		if (segment.type === "text") {
			// Text
			if (text[i] === "@") {
				// Start of username
				segments.push(segment);
				segment = {
					type: "username",
					string: ""
				};
			} else if (text[i] === "#") {
				// Start of tag
				segments.push(segment);
				segment = {
					type: "tag",
					string: ""
				};
			} else {
				// Continue
				segment.string += text[i];
			}
		} else {
			// Not Text
			if (text[i].match(/[^a-zA-Z0-9]/)) {
				// Non-Alphanumeric, switch back to string
				segments.push(segment);
				segment = {
					type: "text",
					string: text[i]
				};
			} else {
				// Continue
				segment.string += text[i].toLowerCase();
			}
		}
	}
	segments.push(segment);

	return segments;
};
