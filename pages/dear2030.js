import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import theme from "../theme";
import config from "../config";
import { useEffect, useState, createRef } from "react";
import axios from "axios";

import Button from "../components/Button";
import SmallText from "../components/SmallText";

export default withAuth(props => {
	const [textareaHeight, setTextareaHeight] = useState(0);
	const [buttonConfirm, setConfirm] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState();
	const textareaRef = createRef();

	useEffect(() => {
		if (textareaHeight !== 0) return;
		setTextareaHeight(
			textareaRef.current.scrollHeight
				? textareaRef.current.scrollHeight + 30
				: 140
		);
	}, [textareaHeight]);

	const send = () => {
		const content = textareaRef.current.value;
		if (buttonConfirm) {
			setLoading(true);
			axios
				.post(
					`${config.apiUrl}/2030`,
					{
						content
					},
					{
						headers: {
							authorization: props.user.sessionToken
						}
					}
				)
				.then(() => {
					setCompleted(true);
				})
				.catch(error => {
					if (error.response) {
						const { err } = error.response.data;
						if (err === "alreadyDone") {
							setFormError("You've already sent a letter.");
						} else {
							setFormError("Something went wrong.");
						}
					}
					setLoading(false);
				});
		} else {
			setConfirm(true);
		}
	};

	return (
		<Page title="Dear 2030" header user={props.user}>
			<main>
				<h1>Dear 2030</h1>

				{!completed ? (
					<>
						<p>
							Write a letter to yourself in ten years. We'll try our best to get
							it back to you.
						</p>
						<textarea
							defaultValue={`Dear ${props.user.nickname},\n\n\n\nSee you in 10 years!\nFrom ${props.user.nickname}`}
							onChange={() => setTextareaHeight(0)}
							style={{ height: textareaHeight }}
							ref={textareaRef}
							maxLength="5000"
						></textarea>

						<SmallText>Once you send the letter, you can't edit it.</SmallText>
						<Button
							disabled={loading}
							style={{
								marginLeft: "auto",
								display: "block"
							}}
							onClick={send}
						>
							{!buttonConfirm ? "Send" : "Are you sure?"}
						</Button>
						{formError ? (
							<p style={{ color: theme.error }}>{formError}</p>
						) : (
							<></>
						)}
					</>
				) : (
					<>
						<p>You've sent your letter!</p>
						<SmallText>
							<i>
								The distinction between the past, present and future is but a
								stubborn illusion.
							</i>
						</SmallText>
					</>
				)}
			</main>

			<footer>Made with &#x2764; by Alles</footer>

			<style jsx>{`
				main,
				footer {
					background: white;
					padding: 20px;
					border-radius: 10px;
					border: solid 1px ${theme.borderGrey};
					max-width: 1000px;
					margin: 0 auto;
					overflow: hidden;
				}

				footer {
					margin-top: 20px;
				}

				textarea {
					border: solid 1px ${theme.borderGrey};
					resize: none;
					width: 100%;
					border-radius: 10px;
					padding: 10px;
					box-sizing: border-box;
					font-family: ${theme.font};
					font-size: 15px;
				}
			`}</style>
		</Page>
	);
});
