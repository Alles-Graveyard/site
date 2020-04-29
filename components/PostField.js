import theme from "../reactants/theme";
import TextArea from "../reactants/TextArea";
import {ChevronRight} from "react-feather";
import {useState} from "react";
import config from "../config";
import axios from "axios";

export default props => {
	const [charCount, setCharCount] = useState(null);
	const [content, setContent] = useState();

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
		<section>
			<TextArea
				wide
				style={{
					margin: 0,
					height: 150,
					borderTopRightRadius: 0,
					borderBottomRightRadius: 0,
					minWidth: 0
				}}
				placeholder={props.placeholder}
				maxLength={config.maxPostLength}
				onChange={e => {
					setContent(e.target.value.trim());
					setCharCount(
						e.target.value.length < config.maxPostLength - 50
							? null
							: config.maxPostLength - e.target.value.length
					);
				}}
			/>

			<aside>
				<div className="charCount">
					<p>{charCount}</p>
				</div>

				<button onClick={submit}>
					<ChevronRight />
				</button>
			</aside>

			<style jsx>{`
				section {
					width: 100%;
					margin: 20px 0;
					display: flex;
				}

				aside {
					background: white;
					border: solid 1px ${theme.borderGrey};
					margin-left: 10px;
					width: 35px;
					border-radius: 0 10px 10px 0;
					flex-shrink: 0;
					overflow: hidden;
					display: flex;
					flex-flow: column;
				}

				.charCount {
					opacity: ${charCount === null ? 0 : 1};
					height: ${charCount === null ? 0 : "30px"};
					transition: all 0.1s;
					transition-timing-function: ease-in-out;
					display: flex;
					flex-flow: column;
					justify-content: center;
				}

				.charCount p {
					text-align: center;
					margin: 0;
				}

				button {
					width: 100%;
					font-size: 1em;
					box-sizing: border-box;
					background: ${theme.accent};
					border: solid 1px ${theme.accent};
					color: white;
					cursor: pointer;
					transition: all 0.1s;
					transition-timing-function: ease-in-out;
					font-family: Rubik;
					padding: 0;
					flex-grow: 1;
				}

				button:disabled {
					border-color: ${theme.borderGrey};
					background: ${theme.disabledBackground};
					color: ${theme.grey4};
					cursor: default;
				}

				button:hover:enabled {
					opacity: 0.8;
				}

				button:active:enabled {
					opacity: 0.5;
				}

				button::-moz-focus-inner {
					border: 0;
				}
			`}</style>
		</section>
	);
};
