import theme from "../theme";

export default ({ wide, ...props }) => (
	<>
		<input {...props} />
		<style jsx>{`
            input {
                ${wide ? "width: 100%;" : ""}
                border: solid 1px ${theme.borderGrey};
                padding: 10px;
                font-size: 1em;
                box-sizing: border-box;
                margin: 10px 0px;
                border-radius: 5px;
                font-family: ${theme.font};
                transition: all 0.2s;
                transition-timing-function: ease-in-out;
            }
            
            input:focus {
            	border-color: black;
            }
        `}</style>
	</>
);
