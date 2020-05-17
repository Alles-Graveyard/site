import {useState, useEffect} from "react";
import axios from "axios";
import Link from "next/link";
import {Plus, Minus} from "react-feather";
import config from "../config";
import moment from "moment";
import {Box, Avatar} from "@reactants/ui";

export default ({data, ...props}) => {
	const [vote, setVote] = useState(data.vote);
	const [score, setScore] = useState(data.score);
	const dateFormat = "MMM DD YYYY HH:mm";
	const [date, setDate] = useState(dateFormat);

	useEffect(() => setDate(moment(data.createdAt).format(dateFormat)), []);

	const changeVote = v => {
		if (!props.sessionToken) return;
		setVote(v);
		if (typeof score === "number") {
			if (vote === -1 && v === 0) setScore(score + 1);
			if (vote === -1 && v === 1) setScore(score + 2);
			if (vote === 0 && v === -1) setScore(score - 1);
			if (vote === 0 && v === 1) setScore(score + 1);
			if (vote === 1 && v === 0) setScore(score - 1);
			if (vote === 1 && v === -1) setScore(score - 2);
		}

		axios
			.post(
				`${config.apiUrl}/post/${data.slug}/vote`,
				{
					vote: v
				},
				{
					headers: {
						authorization: props.sessionToken
					}
				}
			)
			.catch(() => {});
	};

	const MainContainer = () => (
		<div className="mainContainer">
			<header>
				<Avatar username={data.author.username} size={50} />
				<div>
					<h1>
						{data.author.name}
						{data.author.plus ? <sup>+</sup> : <></>}
					</h1>
					<h2>@{data.author.username}</h2>
				</div>
			</header>

			<main>
				<p className="content">{data.content}</p>
				<div className="image">
					<img src={data.image} />
				</div>
			</main>

			<footer>
				<p>
					{date} // {data.replies} {data.replies === 1 ? "Reply" : "Replies"}
				</p>
			</footer>

			<style jsx>{`
				.mainContainer {
					padding: 10px;
					flex-grow: 1;
				}

				header {
					display: flex;
				}

				header div {
					margin-left: 10px;
				}

				header h1 {
					margin: 0 5px;
					font-size: 20px;
					font-weight: 500;
				}

				header h2 {
					margin: 0 5px;
					font-size: 16px;
					font-weight: 400;
				}

				p.content {
					white-space: pre-wrap;
				}

				.image {
					width: 100%;
					max-height: 300px;
					border-radius: var(--radius);
					overflow: hidden;
					display: flex;
					justify-content: center;
					flex-flow: column nowrap;
				}

				.image img {
					width: 100%;
					margin: 0 auto;
				}

				footer p {
					color: var(--accents-6);
					font-size: 12px;
				}
			`}</style>
		</div>
	);

	return (
		<Box
			style={{
				display: "flex"
			}}
		>
			<aside>
				<Plus
					style={{
						cursor: "pointer",
						margin: "5px auto",
						color: `var(--${vote === 1 ? "primary" : "accents-6"})`
					}}
					onClick={() => changeVote(vote === 1 ? 0 : 1)}
				/>

				<p className="score">{score}</p>

				<Minus
					style={{
						cursor: "pointer",
						margin: "5px auto",
						color: `var(--${vote === -1 ? "primary" : "accents-6"})`
					}}
					onClick={() => changeVote(vote === -1 ? 0 : -1)}
				/>
			</aside>

			{!props.expanded ? (
				<Link
					href="/[username]/[slug]"
					as={`/${data.author.username}/${data.slug}`}
				>
					<a className="main">
						<MainContainer />
					</a>
				</Link>
			) : (
				<MainContainer />
			)}

			<style jsx>{`
				aside {
					flex-shrink: 0;
					padding: 10px;
					display: flex;
					flex-flow: column;
					justify-content: center;
					width: 50px;
				}

				aside p {
					margin: 5px auto;
				}

				.main {
					flex-grow: 1;
					width: 100%;
				}
			`}</style>
		</Box>
	);
};
