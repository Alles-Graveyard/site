import {useState, useEffect} from "react";
import axios from "axios";

export default ({id, ...props}) => {
	const [online, setOnline] = useState(false);

	useEffect(() => {
		const getStatus = async () => {
			try {
				setOnline(
					(
						await axios.get(
							`https://online.alles.cx/${id}?t=${new Date().getTime()}`
						)
					).data === "🟢"
				);
			} catch (err) {
				setOnline(false);
			}
		};

		const interval = setInterval(getStatus, 5000);
		getStatus();
		return () => clearInterval(interval);
	}, []);

	return (
		<div {...props}>
			<style jsx>{`
				div {
					height: 10px;
					width: 10px;
					border-radius: 50%;
					background: ${online ? "#07de40" : "#444444"};
					display: inline-block;
				}
			`}</style>
		</div>
	);
};
