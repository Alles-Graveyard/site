import {useEffect} from "react";
import consoleWarning from "../util/consoleWarning";
import {Header, Breadcrumb, Avatar, ThemeScript} from "@reactants/ui";
import Banner from "./Banner";
import Link from "next/link";
import Head from "next/head";

export default props => {
	useEffect(consoleWarning, []);

	return (
		<>
			<Head>
				<title>{props.title ? `Alles • ${props.title}` : "Alles"}</title>
				<ThemeScript />
			</Head>

			<Header>
				<Breadcrumb>
					<Link href="/" passHref>
						<Breadcrumb.Item as="h4" text="Alles" />
					</Link>

					{props.breadcrumbs ? (
						props.breadcrumbs.map((b, i) =>
							b.href ? (
								<Link href={b.href} as={b.as} passHref key={i}>
									<Breadcrumb.Item text={b.name} />
								</Link>
							) : (
								<Breadcrumb.Item text={b.name} key={i} />
							)
						)
					) : (
						<></>
					)}
				</Breadcrumb>

				{props.user ? (
					<Link href="/me">
						<a>
							<Avatar username={props.user.username} size={50} />
						</a>
					</Link>
				) : (
					<></>
				)}
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
