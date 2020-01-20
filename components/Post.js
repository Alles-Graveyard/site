import theme from "../theme";
import Link from "next/link";
import {useState} from "react";

export default props => {
    const post = props.data;
    const [liked, setLiked] = useState(post.liked);
    const [boosted, setBoosted] = useState(post.boosted);

    return (
        <article>
            <Link href="/u/[user]" as={`/u/${post.author.username}`}>
                <div className="author">
                    <img className="profilePicture" src="https://pbs.twimg.com/profile_images/1180922399790944257/3lC1YOEY_400x400.png" />
                    <div className="authorInner">
                        <p className="name">{post.author.name}</p>
                        <p className="username">@{post.author.username}</p>
                    </div>
                </div>
            </Link>

            <div className="content">
                <p>{post.content}</p>
            </div>

            <div className="buttons">
                <i className={liked ? "fas fa-heart liked" : "far fa-heart"} onClick={() => {
                    setLiked(!liked);
                }}></i>
                <i className={boosted ? "fas fa-star boosted" : "far fa-star"} onClick={() => {
                    if (!boosted) {
                        setBoosted(true);
                    }
                }}></i>
                {props.moreButton ? <Link href="/p/[post]" as={`/p/${post.id}`}><i className="fas fa-plus"></i></Link> : <></>}
            </div>

            <style jsx>{`
                article {
                    width: 100%;
                    border: solid 1px ${theme.borderGrey};
                    border-radius: 5px;
                    margin: 30px 0;
                    padding: 10px;
                    box-sizing: border-box;
                }

                .author {
                    display: flex;
                    cursor: pointer;
                }

                .author img {
                    border: solid 1px ${theme.borderGrey};
                    border-radius: 50%;
                    height: 2.5em;
                    width: 2.5em;
                    vertical-align: middle;
                    margin-right: 10px;
                }

                .author p {
                    margin: 0;
                }

                .author .name {
                    font-size: 20px;
                }

                .author .username {
                    font-size: 10px;
                    font-weight: 300;
                }

                .buttons {
                    display: flex;
                }

                .buttons i {
                    padding: 10px;
                    margin: 0 auto;
                    cursor: pointer;
                    color: ${theme.grey4};
                }

                .buttons i.liked {
                    color: ${theme.heart};
                }

                .buttons i.boosted {
                    color: ${theme.boost};
                }
            `}</style>
        </article>
    );
};