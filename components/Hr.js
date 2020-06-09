export default ({margin}) => (
	<div>
		<style jsx>{`
			div {
				width: 100%;
				height: 3px;
				background: var(--accents-2);
				margin: ${margin ? margin : "20px"} 0;
				border-radius: 100px;
			}
		`}</style>
	</div>
);
