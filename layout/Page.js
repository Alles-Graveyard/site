import {useEffect} from "react";
import consoleWarning from "../util/consoleWarning";

import Head from "next/head";
import Header from "./Header";

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

            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css?family=Rubik:300,400,500,700,900&display=swap");
                @import url("https://use.fontawesome.com/releases/v5.12.0/css/all.css");

                body {
                    font-family: Rubik, sans-serif;
                    margin: 0;
                }

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
        </div>
    );
};