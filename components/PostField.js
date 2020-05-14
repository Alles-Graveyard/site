import {Box, Textarea, Button} from "@reactants/ui";
import {useState, createRef} from "react";
import config from "../config";
import axios from "axios";
import {Image, X} from "react-feather";

export default props => {
	const [content, setContent] = useState("");
	const [imageUpload, setImage] = useState();
	const [imageSrc, setImageSrc] = useState();
	const imageInput = createRef();

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

	const iconStyle = {
		color: "var(--accents-6)",
		height: 20,
		margin: 10,
		cursor: "pointer"
	};

	return (
		<Box
			style={{
				overflow: "hidden"
			}}
		>
			<Textarea
				placeholder={props.placeholder}
				maxLength={config.maxPostLength}
				onChange={e => setContent(e.target.value.trim())}
				style={{
					background: "transparent",
					height: 150
				}}
			/>

			{imageSrc ? (
				<div className="image">
					<img
						src={imageSrc}
						onError={() => {
							setImage();
							setImageSrc();
						}}
					/>
					<X
						style={{
							position: "absolute",
							top: 25,
							right: 25,
							background: "var(--accents-2)",
							color: "var(--accents-6)",
							borderRadius: "50%",
							cursor: "pointer"
						}}
						onClick={() => {
							setImage();
							setImageSrc();
						}}
					/>
				</div>
			) : (
				<></>
			)}

			<div className="icons">
				<Image style={iconStyle} onClick={() => imageInput.current.click()} />
			</div>

			<input
				ref={imageInput}
				type="file"
				accept="image/png, image/jpeg"
				style={{
					display: "none"
				}}
				onChange={e => {
					const f = e.target.files[0];
					const reader = new FileReader();
					reader.onload = e => {
						setImage(f);
						setImageSrc(e.target.result);
					};
					reader.readAsDataURL(f);
				}}
			/>

			<Button
				primary
				disabled={!content}
				onClick={submit}
				style={{
					width: "calc(100% - 40px)",
					margin: 20
				}}
			>
				Post
			</Button>

			<style jsx>{`
				.image {
					padding: 20px;
					position: relative;
				}

				.image img {
					width: 100%;
					border: solid 1px var(--accents-2);
					border-radius: var(--radius);
				}

				.icons {
					padding: 0 10px;
				}
			`}</style>
		</Box>
	);
};
