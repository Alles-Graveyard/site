export default text => {
	const segments = [];

	let segment = {
		type: "text",
		string: ""
	};

	const endSegment = () => {
		if (segment.string || segment.type === "text") segments.push(segment);
		else if (segment.type === "username")
			segments[segments.length - 1].string += "@";
		else if (segment.type === "tag")
			segments[segments.length - 1].string += "#";
	};

	for (let i = 0; i < text.length; i++) {
		if (segment.type === "text") {
			// Text
			if (text[i] === "@") {
				// Start of username
				endSegment();
				segment = {
					type: "username",
					string: ""
				};
			} else if (text[i] === "#") {
				// Start of tag
				endSegment();
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
				endSegment();
				segment = {
					type: "text",
					string: ""
				};
				i -= 1;
			} else {
				// Continue
				segment.string += text[i].toLowerCase();
			}
		}
	}
	endSegment();

	return segments;
};
