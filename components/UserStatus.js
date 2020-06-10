import {useState, useEffect} from "react";

export default ({id, ...props}) => {
	const [online, setOnline] = useState(false);

	useEffect(() => {
		const getStatus = () => {
			setOnline(Math.floor(Math.random() * 2) === 0);
		};

		const interval = setInterval(getStatus, 1000);
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
					border: solid 1px ${online ? "#07de40" : "#000000"};
					background: ${online ? "#07de40" : "none"};
					display: inline-block;
				}
			`}</style>
		</div>
	);
};
