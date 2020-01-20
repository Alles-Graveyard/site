import {useEffect} from "react";
import consoleWarning from "../util/consoleWarning";

import Head from "next/head";
import Header from "./Header";

export default props => {

    useEffect(consoleWarning, []);
    
    return (
        <>
            <Head>
                <title>{props.title ? `Alles • ${props.title}` : "Alles"}</title>
            </Head>
            {props.header ? <Header user={props.user} /> : <></>}
            <main>
                {props.children}
            </main>

            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css?family=Rubik:300,400,500,700,900&display=swap");
                @import url("https://use.fontawesome.com/releases/v5.12.0/css/all.css");

                body {
                    font-family: Rubik, sans-serif;
                    margin: 0;
                }

                main {
                    padding: ${props.padding ? "20px" : "0px"};
                    max-width: ${props.centerContainer ? "600px" : "unset"};
                    margin: ${props.centerContainer ? "auto" : "unset"};
                }
            `}</style>
        </>
    );
};