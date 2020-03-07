import { useEffect } from "react";
import consoleWarning from "../util/consoleWarning";
import theme from "../theme";

import Head from "next/head";
import Header from "./Header";
import Banner from "./Banner";

export default props => {
	useEffect(consoleWarning, []);

	return (
		<div className="pageContainer">
			<Head>
				<title>{props.title ? `Alles • ${props.title}` : "Alles"}</title>
			</Head>
			{props.header ? <Header user={props.user} /> : <></>}
			<main style={props.style}>{props.children}</main>

			{props.banner ? (
				<Banner message={props.banner.message} update={props.banner.update} />
			) : (
				<></>
			)}

			<style jsx>{`
				.pageContainer {
					display: flex;
					flex-flow: column;
					min-height: 100vh;
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

				body {
					margin: 0;
				}

				body,
				input,
				button {
					font-family: Rubik, sans-serif;
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
