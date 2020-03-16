import theme from "../theme";
import {useState, useEffect} from "react";

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
			<i
				className="fas fa-times"
				onClick={() => {
					setClosed(true);
				}}
			></i>

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

				.banner p,
				.banner i {
					display: flex;
					flex-flow: column;
					justify-content: center;
				}

				.banner p {
					margin: 0;
					flex-grow: 1;
				}

				.banner i {
					border-radius: 50%;
					text-align: center;
					width: 20px;
					height: 20px;
					cursor: pointer;
					padding: 10px;
					flex-shrink: 0;
				}

				.banner i:hover {
					background: ${theme.greyF};
				}
			`}</style>
		</div>
	);
};
