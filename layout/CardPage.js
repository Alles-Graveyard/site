import Page from "./Page";
import theme from "../theme";

export default ({logo, ...props}) => (
    <Page header style={{background: theme.greyF, padding: "0px"}} {...props}>
        <div className="container">
            <main>
                {
                    logo ? (
                        <img src="/a00.png" className="allesLogo" />
                    ) : <></>
                }
                {props.children}
            </main>
        </div>

        <style jsx>{`
            main {
                background: white;
                max-width: 400px;
                min-height: 500px;
                margin: 0 auto;
                border-radius: 10px;
                box-sizing: border-box;
                padding: 30px;
            }

            .container {
                display: flex;
                flex-flow: column;
                justify-content: center;
                height: 100%;
            }

            @media screen and (max-height: 650px) {
                .container {
                    display: block;
                }

                main {
                    min-height: 100%;
                    border-radius: 0;
                }
            }

            @media screen and (max-width: 400px) {
                main {
                    width: 100%;
                    border-radius: 0;
                }
            }

            .allesLogo {
                height: 100px;
                width: 100px;
                margin: 0 auto;
                display: block;
            }
        `}</style>
    </Page>
);