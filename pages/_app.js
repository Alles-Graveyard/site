import {withTheme} from "@reactants/ui";
import "@reactants/ui/dist/index.css";
import "@reactants/ui/dist/global.css";

export default withTheme(({Component, pageProps}) => <Component {...pageProps} />);