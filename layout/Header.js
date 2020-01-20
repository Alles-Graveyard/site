import Link from "next/link";
import theme from "../theme";

export default props => (
    <header>
        <div className="headerMain">
            <Link href="/"><a className="home">Alles</a></Link>
        </div>

        <Link href="/me">
            <div className="user">
                <div className="userInner">
                    <p className="nickname">{props.user.nickname}</p>
                    <p className="username">@{props.user.username}</p>
                </div>
                <img className="profilePicture" src="https://pbs.twimg.com/profile_images/1180922399790944257/3lC1YOEY_400x400.png" />
            </div>
        </Link>

        <style jsx>{`
            header {
                display: flex;
                padding: 10px;
                border-bottom: solid 1px ${theme.borderGrey};
            }

            .headerMain {
                flex-grow: 1;
                display: flex;
                overflow-x: auto;
                font-size: 25px;
                vertical-align: middle;
            }

            a {
                color: inherit;
                text-decoration: none;
                padding: 0 10px;
                margin: auto 5px;
            }

            a.home {
                font-weight: 700;
            }

            .user {
                border-radius: 100px;
                padding: 5px 5px 5px 15px;
                cursor: pointer;
                vertical-align: middle;
                display: flex;
                border: solid 1px ${theme.borderGrey};
            }

            .user img {
                border-bottom: solid 1px ${theme.borderGrey};
                border-radius: 50%;
                height: 2.5em;
                width: 2.5em;
                vertical-align: middle;
                margin: auto 0 auto 5px;
            }

            .user .userInner {
                text-align: right;
            }

            .user p {
                margin: 0;
            }

            .user .nickname {
                font-size: 20px;
            }

            .user .username {
                font-size: 10px;
                font-weight: 300;
            }
        `}</style>
    </header>
);