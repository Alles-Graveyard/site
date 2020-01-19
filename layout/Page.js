import Head from "next/head";
import Header from "./Header";

export default props => (
    <>
        <Head>
            <title>{props.title ? `Alles • ${props.title}` : "Alles"}</title>
            <link href="https://fonts.googleapis.com/css?family=Rubik:400,500,700,900&display=swap" />
        </Head>
        {props.header ? <Header /> : <></>}
        <main>
            {props.children}
        </main>

        <style jsx global>{`
            body {
                font-family: Rubik, sans-serif;
                margin: 0;
            }

            main {
                padding: ${props.padding ? "20px" : "0px"};
            }
        `}</style>
    </>
);