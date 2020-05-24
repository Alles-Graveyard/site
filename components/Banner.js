import {useState, useEffect} from "react";
import {X} from "react-feather";
import {Box} from "@reactants/ui";

export default props => {
	const [closed, setClosed] = useState(true);

	useEffect(() => {
		setClosed(!props.message);
	}, [props.update]);

	return closed ? (
		<></>
	) : (
		<div>
			<Box
				style={{
					width: "calc(100% - 40px)",
					maxWidth: 800,
					padding: "10px 20px",
					boxSizing: "border-box",
					background: "var(--surface)",
					margin: "20px auto",
					border: "solid 1px var(--accents-2)",
					borderRadius: "var(--radius)",
					display: "flex"
				}}
			>
				<p>{props.message}</p>
				<X
					onClick={() => {
						setClosed(true);
					}}
					style={{
						cursor: "pointer",
						flexShrink: 0,
						color: "var(--accents-6)"
					}}
				/>
			</Box>

			<style jsx>{`
				div {
					position: fixed;
					bottom: 0;
					width: 100%;
				}

				p {
					display: flex;
					flex-flow: column;
					justify-content: center;
					margin: 0;
					flex-grow: 1;
				}
			`}</style>
		</div>
	);
};
