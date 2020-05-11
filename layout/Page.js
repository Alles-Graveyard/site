import {useEffect} from "react";
import consoleWarning from "../util/consoleWarning";
import {Header, Breadcrumb} from "@reactants/ui";
import Banner from "./Banner";
import Link from "next/link";
import Head from "next/head";

export default props => {
	useEffect(consoleWarning, []);

	return (
		<>
			<Head>
				<title>{props.title ? `Alles • ${props.title}` : "Alles"}</title>
			</Head>

			<Header>
				<Breadcrumb>
					<Link href="/" passHref>
						<Breadcrumb.Item as="h4" text="Alles" />
					</Link>
				</Breadcrumb>
			</Header>

			<main style={props.style}>{props.children}</main>

			{props.banner ? (
				<Banner message={props.banner.message} update={props.banner.update} />
			) : (
				<></>
			)}

			<style jsx>{`
				main {
					padding: 0 25px 50px;
					max-width: 800px;
					margin: 80px auto 0;
				}
			`}</style>

			<style jsx global>{`
				a {
					color: inherit;
					text-decoration: none;
				}

				a.normal {
					color: var(--primary);
					text-decoration: underline;
				}
			`}</style>
		</>
	);
};
