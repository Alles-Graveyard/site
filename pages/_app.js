import Router from "next/router";
import NProgress from "nprogress";
import "@reactants/ui/dist/global.css";
import "../nprogress.css";

// Progress Bar
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

// Export
export default ({Component, pageProps}) => <Component {...pageProps} />;
