import {Avatar} from "@reactants/ui";

export default ({user, ...props}) => (
	<article {...props}>
		<div className="left">
			<Avatar username={user.username} size={40} />
			<h1>
				{user.name}
				{user.plus ? <sup>+</sup> : <></>}
			</h1>
		</div>
		<h2>@{user.username}</h2>

		<style jsx>{`
			article {
				display: flex;
				background: #ffffff;
				padding: 20px;
				margin: 20px 0;
				border-radius: 20px;
				border: solid 1px var(--accents-2);
				overflow: hidden;
			}

			article:hover {
				border-color: var(--accents-4);
			}

			article h1 {
				font-size: 20px;
				font-weight: 500;
				margin: auto 0;
				margin-left: 10px;
			}

			article h2 {
				font-size: 15px;
				font-weight: 400;
				margin: auto 0;
				color: var(--accents-6);
				text-align: right;
			}

			article .left {
				display: flex;
				flex-grow: 1;
			}
		`}</style>
	</article>
);
