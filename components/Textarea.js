import theme from "../theme";

export default ({wide, ...props}) => (
	<>
		<textarea {...props} />
		<style jsx>{`
            textarea {
                ${wide ? "width: 100%;" : ""}
                border: solid 1px ${theme.borderGrey};
                padding: 10px;
                font-size: 1em;
                box-sizing: border-box;
                margin: 10px 0px;
                border-radius: 5px;
                transition: all 0.1s;
                transition-timing-function: ease-in-out;
                resize: none;
            }
            
            textarea:focus {
            	border-color: black;
            }
        `}</style>
	</>
);
