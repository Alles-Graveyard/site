import {useEffect} from "react";
import consoleWarning from "../util/consoleWarning";
import theme from "../theme";

import Head from "next/head";
import Header from "./Header";
import Banner from "./Banner";

export default props => {
	useEffect(consoleWarning, []);

	return (
		<div className="page">
			<Head>
				<title>{props.title ? `Alles • ${props.title}` : "Alles"}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			{props.header ? <Header user={props.user} /> : <></>}
			<main style={props.style}>{props.children}</main>

			{props.banner ? (
				<Banner message={props.banner.message} update={props.banner.update} />
			) : (
				<></>
			)}

			<style jsx>{`
				.page {
					display: flex;
					flex-flow: column;
				}

				main {
					padding: 20px;
					flex-grow: 1;
					background: ${theme.greyF};
				}
			`}</style>

			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css?family=Rubik:300,400,500,700,900&display=swap");
				@import url("https://use.fontawesome.com/releases/v5.12.0/css/all.css");

				html,
				body,
				body > div:first-child,
				div#__next,
				.page {
					height: 100%;
					margin: 0;
				}

				body,
				input,
				textarea,
				button {
					font-family: Rubik;
				}

				a {
					color: inherit;
					text-decoration: none;
				}

				a.normal {
					color: ${theme.accent};
					text-decoration: underline;
				}

				a.nocolor {
					text-decoration: underline;
				}
			`}</style>
		</div>
	);
};
