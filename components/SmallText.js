import theme from "../theme";

export default props => (
    <>
        <p>{props.children}</p>
        <style jsx>{`
            p {
                margin: 0;
                color: ${theme.greyText};
                font-size: 12px;
                text-transform: uppercase;
            }
        `}</style>
    </>
);