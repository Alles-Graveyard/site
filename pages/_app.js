import Router from "next/router";
import NProgress from "nprogress";
import {withTheme} from "@reactants/ui";
import "@reactants/ui/dist/index.css";
import "@reactants/ui/dist/global.css";
import "../nprogress.css";

// Progress Bar
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

// Export
export default withTheme(({Component, pageProps}) => (
	<Component {...pageProps} />
));
