import theme from "../theme";

export default props => (
	<article {...props}>
		<div className="left">
			<img src={`https://avatar.alles.cx/user/${props.user.id}`} />
			<h1>
				{props.user.name}
				{props.user.plus ? <sup>+</sup> : <></>}
			</h1>
		</div>
		<h2>@{props.user.username}</h2>

		<style jsx>{`
			article {
				display: flex;
				background: #ffffff;
				padding: 20px;
				margin: 20px 0;
				border-radius: 20px;
				border: solid 1px ${theme.borderGrey};
				overflow: hidden;
			}

			article:hover,
			article:hover img {
				border-color: ${theme.grey8};
			}

			article h1 {
				font-size: 20px;
				font-weight: 500;
				margin: auto 0;
			}

			article h2 {
				font-size: 15px;
				font-weight: 400;
				margin: auto 0;
				color: ${theme.grey4};
				text-align: right;
			}

			article img {
				height: 30px;
				width: 30px;
				border-radius: 50%;
				margin-right: 10px;
				border: solid 1px ${theme.borderGrey};
				flex-shrink: 0;
			}

			article .left {
				display: flex;
				flex-grow: 1;
			}
		`}</style>
	</article>
);
