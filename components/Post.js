import {useState} from "react";
import axios from "axios";
import Link from "next/link";
import theme from "../reactants/theme";
import {Plus, Minus} from "react-feather";

export default ({data, ...props}) => {
    const [vote, setVote] = useState(data.vote);
    const [upvotes, setUpvotes] = useState(data.upvotes);
    const [downvotes, setDownvotes] = useState(data.downvotes);
    const [score, setScore] = useState(data.score);

    const MainContainer = () => (
        <div className="mainContainer">
            <header>
                <img src={`https://avatar.alles.cx/user/${data.author.id}`} />
                <div>
                    <h1>{data.author.name}</h1>
                    <h2>@{data.author.username}</h2>
                </div>
            </header>

            <main>
                <p className="content">{data.content}</p>
            </main>

            <style jsx>{`
                div.mainContainer {
                    padding: 10px;
                    flex-grow: 1;
                }

                header {
                    display: flex;
                }

                header img {
                    width: 50px;
                    height: 50px;
                    border: solid 1px ${theme.borderGrey};
                    border-radius: 50%;
                    margin-right: 10px;
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
            `}</style>
        </div>
    );

    return (
		<article>
            <aside>
                <Plus style={{
                    cursor: "pointer",
                    margin: "5px auto"
                }} />

                <p className="score">{score}</p>

                <Minus style={{
                    cursor: "pointer",
                    margin: "5px auto"
                }} />
            </aside>

			{props.link ? (
                <Link href="/p/[slug]" as={`/p/${data.slug}`}>
                    <a className="main">
                        <MainContainer />
                    </a>
                </Link>
            ) : (
                <MainContainer />
            )}

            <style jsx>{`
                article {
                    width: 100%;
                    margin: 20px 0;
                    background: white;
                    border: solid 1px ${theme.borderGrey};
                    border-radius: 10px;
                    display: flex;
                }

                aside {
                    flex-shrink: 0;
                    padding: 10px;
                    display: flex;
                    flex-flow: column;
                    justify-content: center;
                }

                aside p {
                    margin: 5px auto;
                }

                .main {
                    flex-grow: 1;
                }
            `}</style>
		</article>
    );
};
