import Link from "next/link";
import theme from "../reactants/theme";

export default props => (
	<>
		{props.basic ? (
			<a href={props.href}>{props.children}</a>
		) : (
			<Link href={props.href} as={props.as}>
				<a>{props.children}</a>
			</Link>
		)}

		<style jsx>{`
			a {
				display: block;
				padding: 10px;
				border: 1px;
				cursor: pointer;
				color: black;
				text-decoration: none;
				border: 1px transparent;
				border-style: solid none;
				margin: 0;
				transition: 0.1s;
			}

			a:hover {
				border-color: ${theme.borderGrey};
				color: ${theme.accent};
			}
		`}</style>
	</>
);
