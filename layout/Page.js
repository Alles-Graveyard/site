import {useEffect} from "react";
import consoleWarning from "../util/consoleWarning";
import {Header, withTheme, useTheme} from "@reactants/ui/Header";
import Banner from "./Banner";

export default props => {
	useEffect(consoleWarning, []);

	return (
		<div className="page">
			<Head title={props.title ? `Alles • ${props.title}` : "Alles"} />

			<Header
				title="Alles"
				user={
					props.user
						? {
								id: props.user.id,
								href: "/me"
						  }
						: null
				}
				breadcrumbs={props.breadcrumbs}
			/>

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
		</div>
	);
};
