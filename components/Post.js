import {useState, useEffect} from "react";
import axios from "axios";
import Link from "next/link";
import {Plus, Minus, Trash2} from "react-feather";
import TagWrapper from "../components/Tags";
import config from "../config";
import moment from "moment";
import {Box, Avatar} from "@reactants/ui";
import Router from "next/router";

export default ({data, ...props}) => {
	const [vote, setVote] = useState(data.vote);
	const [score, setScore] = useState(data.score);
	const dateFormat = "MMM DD YYYY HH:mm";
	const [date, setDate] = useState(dateFormat);
	const [removed, setRemoved] = useState(data.removed);

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
				`${process.env.NEXT_PUBLIC_APIURL}/post/${data.slug}/vote`,
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

	const navigateToPost = () => {
		if (!props.expanded)
			Router.push(
				"/[username]/[slug]",
				`/${data.author.username}/${data.slug}`
			);
	};

	return !removed ? (
		<Box
			style={{
				display: "flex",
				position: "relative"
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

			<div className="mainContainer" onClick={navigateToPost}>
				<Link href="/[username]" as={`/${data.author.username}`}>
					<a onClick={e => e.stopPropagation()}>
						<header>
							<Avatar
								username={data.author.username}
								size={50}
								style={{
									flexShrink: 0
								}}
							/>
							<div>
								<h1>
									{data.author.name}
									{data.author.plus ? <sup>+</sup> : <></>}
								</h1>
								<h2>@{data.author.username}</h2>
							</div>
						</header>
					</a>
				</Link>

				<main>
					<p className="content">
						<TagWrapper>{data.content}</TagWrapper>
					</p>
					<div className="image">
						<img src={data.image} />
					</div>
				</main>

				<footer>
					<p>
						{date} // {data.replyCount}{" "}
						{data.replyCount === 1 ? "Reply" : "Replies"}
					</p>
				</footer>
			</div>

			{props.self ? (
				<Trash2
					onClick={e => {
						e.stopPropagation();
						setRemoved(true);
						axios
							.post(
								`${process.env.NEXT_PUBLIC_APIURL}/post/${data.slug}/remove`,
								{},
								{
									headers: {
										authorization: props.sessionToken
									}
								}
							)
							.catch(() => {});
					}}
					style={{
						cursor: "pointer",
						color: "var(--accents-4)",
						position: "absolute",
						top: 5,
						right: 5,
						height: 20
					}}
				/>
			) : (
				<></>
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

				.mainContainer {
					padding: 10px;
					flex-grow: 1;
					${!props.expanded ? "cursor: pointer;" : ""}
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
					word-wrap: break-word;
				}

				.image {
					width: 100%;
					${props.expanded ? "" : "max-height: 500px;"}
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
		</Box>
	) : (
		<Box>
			<h1>Removed</h1>

			<style jsx>{`
				h1 {
					font-size: 30px;
					text-align: center;
					color: var(--accents-4);
				}
			`}</style>
		</Box>
	);
};
