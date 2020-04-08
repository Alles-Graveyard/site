import Link from "next/link";
import theme from "../theme";

export default props => (
	<header>
		<div className="headerMain">
			<Link href="/">
				<a className="home">Alles</a>
			</Link>
		</div>

		{props.user ? (
			<Link href="/me">
				<a className="profilePicture">
					<img src={`https://avatar.alles.cx/user/${props.user.id}`} />
				</a>
			</Link>
		) : (
			<></>
		)}

		<style jsx>{`
			header {
				display: flex;
				padding: 10px;
				border-bottom: solid 1px ${theme.borderGrey};
				flex-shrink: 0;
			}

			.headerMain {
				flex-grow: 1;
				display: flex;
				overflow-x: auto;
				font-size: 25px;
				vertical-align: middle;
			}

			a.home {
				color: inherit;
				text-decoration: none;
				padding: 0 10px;
				margin: auto 5px;
			}

			a.home {
				font-weight: 700;
			}

			a.profilePicture {
				margin: auto 0 auto 5px;
			}

			a.profilePicture img {
				border: solid 1px ${theme.borderGrey};
				border-radius: 50%;
				height: 2.5em;
				width: 2.5em;
				cursor: pointer;
				display: block;
			}
		`}</style>
	</header>
);
