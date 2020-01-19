import Link from "next/link";

export default () => (
    <header>
        <Link href="/"><a className="home">Alles</a></Link>
        <Link href="/feed"><a>Feed</a></Link>
        <Link href="/me"><a>Me</a></Link>
        <Link href="/inbox"><a>Inbox</a></Link>

        <style jsx>{`
            header {
                display: flex;
                box-shadow: 0px 2px 2px 2px #aaaaaa;
                padding: 10px;
                overflow-x: auto;
            }

            a {
                color: inherit;
                text-decoration: none;
                margin: 0 auto;
                padding: 0 10px;
            }

            a.home {
                font-weight: bold;
            }
        `}</style>
    </header>
);