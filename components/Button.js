import theme from "../theme";

export default ({secondary, wide, ...props}) => (
    <>
        <button {...props} />
        <style jsx>{`
            button {
                ${wide ? "width: 100%;" : ""}
                border: none;
                padding: 10px;
                font-size: 1em;
                box-sizing: border-box;
                margin: 10px 0px;
                background: ${!secondary ? theme.accent : "none"};
                border: solid 1px ${!secondary ? theme.accent : theme.borderGrey};
                color: ${!secondary ? "white" : "unset"};
                cursor: pointer;
                transition: background 0.1s;
                border-radius: 5px;
                font-family: ${theme.font};
            }

            button:disabled {
                border-color: ${theme.borderGrey};
                background: ${theme.disabledBackground};
                color: ${theme.greyText};
                cursor: default;
            }

            button:hover:enabled {
                opacity: 0.8;
            }

            button:active:enabled {
                opacity: 0.5;
            }
        `}</style>
    </>
);