import Link from "next/link";

export default () => (
    <header>
        <Link href="/"><a className="home">Alles</a></Link>
        <Link href="/feed"><a>Feed</a></Link>
        <Link href="/me"><a>Me</a></Link>
        <Link href="/inbox"><a>Inbox</a></Link>
        <Link href="/groups"><a>Groups</a></Link>
        <Link href="/teams"><a>Teams</a></Link>
        <Link href="/plus"><a>Plus</a></Link>
        <Link href="/terminal"><a>Terminal</a></Link>
        <Link href="/gaming"><a>Gaming</a></Link>
        <Link href="/news"><a>News</a></Link>
        <Link href="/au"><a>Au</a></Link>
        <Link href="/houses"><a>Houses</a></Link>
        <Link href="/docs"><a>Documents</a></Link>
        <Link href="/dev"><a>Developers</a></Link>
        <Link href="/kubase"><a>Kubase</a></Link>
        <Link href="/changelog"><a>Changelog</a></Link>

        <style jsx>{`
            header {
                display: flex;
                background: black;
                padding: 10px;
                overflow-x: auto;
            }

            a {
                color: inherit;
                text-decoration: none;
                padding: 0 10px;
                color: white;
            }

            a.home {
                font-weight: bold;
            }
        `}</style>
    </header>
);