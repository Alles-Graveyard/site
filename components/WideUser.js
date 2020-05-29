import {Avatar, Box} from "@reactants/ui";

export default ({user, style, ...props}) => (
	<Box
		style={{
			display: "flex",
			padding: 20,
			margin: "20px 0",
			overflow: "hidden",
			...style
		}}
		{...props}
	>
		<div className="left">
			<Avatar username={user.username} size={40} />
			<h1>
				{user.name}
				{user.plus ? <sup>+</sup> : <></>}
			</h1>
		</div>
		<h2>@{user.username}</h2>

		<style jsx>{`
			h1 {
				font-size: 20px;
				font-weight: 500;
				margin: auto 0;
				margin-left: 10px;
			}

			h2 {
				font-size: 15px;
				font-weight: 400;
				margin: auto 0;
				color: var(--accents-6);
				text-align: right;
			}

			.left {
				display: flex;
				flex-grow: 1;
			}
		`}</style>
	</Box>
);
