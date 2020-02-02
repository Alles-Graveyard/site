import {useEffect} from "react";
import consoleWarning from "../util/consoleWarning";
import theme from "../theme";

import Head from "next/head";
import Header from "./Header";
import Banner from "./Banner";

export default props => {

    useEffect(consoleWarning, []);
    
    return (
        <div className="pageContainer">
            <Head>
                <title>{props.title ? `Alles • ${props.title}` : "Alles"}</title>
            </Head>
            {props.header ? <Header user={props.user} /> : <></>}
            <main style={props.style}>
                {props.children}
            </main>

            <Banner>{props.banner}</Banner>

            <style jsx>{`
                .pageContainer {
                    display: flex;
                    flex-flow: column;
                    min-height: 100vh;
                }

                main {
                    padding: 20px;
                    flex-grow: 1;
                }
            `}</style>

            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css?family=Rubik:300,400,500,700,900&display=swap");
                @import url("https://use.fontawesome.com/releases/v5.12.0/css/all.css");

                body {
                    font-family: Rubik, sans-serif;
                    margin: 0;
                }

                a {
                    color: ${theme.accent};
                }

                a.nocolor {
                    color: inherit;
                }
            `}</style>
        </div>
    );
};