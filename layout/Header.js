import Link from "next/link";
import theme from "../theme";

export default props => (
    <header>
        <div className="headerMain">
            <Link href="/"><a className="home">Alles</a></Link>
        </div>

        <Link href="/me">
            <img className="profilePicture" src="https://pbs.twimg.com/profile_images/1180922399790944257/3lC1YOEY_400x400.png" />
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

            .profilePicture {
                border: solid 1px ${theme.borderGrey};
                border-radius: 50%;
                height: 2.5em;
                width: 2.5em;
                margin: auto 0 auto 5px;
                cursor: pointer;
            }
        `}</style>
    </header>
);