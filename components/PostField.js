import {Box, Textarea, Button} from "@reactants/ui";
import {useState} from "react";
import config from "../config";
import axios from "axios";

export default props => {
	const [content, setContent] = useState("");

	const submit = () => {
		if (!content || content.length > config.maxPostLength) return;
		axios.post(
			`${config.apiUrl}/post`,
			{
				content
			},
			{
				headers: {
					authorization: props.sessionToken
				}
			}
		);
	};

	return (
		<Box
			style={{
				overflow: "hidden"
			}}
		>
			<Textarea
				placeholder={props.placeholder}
				onChange={e => setContent(e.target.value.trim())}
				style={{
					background: "transparent",
					height: 150
				}}
			/>
			<Button
				primary
				disabled={!content}
				style={{
					borderRadius: 0,
					width: "100%",
					borderStyle: "none",
					borderTopStyle: "solid"
				}}
			>
				Post
			</Button>
		</Box>
	);
};
