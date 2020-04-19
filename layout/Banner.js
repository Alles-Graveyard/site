import theme from "../reactants/theme";
import {useState, useEffect} from "react";
import {X} from "react-feather";

export default props => {
	const [closed, setClosed] = useState(true);

	useEffect(() => {
		setClosed(!props.message);
	}, [props.update]);

	return closed ? (
		<></>
	) : (
		<div className="banner">
			<p>{props.message}</p>
			<X
				onClick={() => {
					setClosed(true);
				}}
				style={{
					display: "flex",
					flexFlow: "column",
					justifyContent: "center",
					textAlign: "center",
					width: 20,
					height: 20,
					cursor: "pointer",
					padding: 10,
					flexShrink: 0
				}}
			/>

			<style jsx>{`
				.banner {
					width: calc(100% - 40px);
					padding: 10px 20px;
					box-sizing: border-box;
					position: fixed;
					bottom: 0;
					background: white;
					margin: 20px;
					border: solid 1px ${theme.borderGrey};
					border-radius: 10px;
					box-shadow: 2px 5px 10px ${theme.grey8};
					display: flex;
				}

				.banner p {
					display: flex;
					flex-flow: column;
					justify-content: center;
				}

				.banner p {
					margin: 0;
					flex-grow: 1;
				}
			`}</style>
		</div>
	);
};
