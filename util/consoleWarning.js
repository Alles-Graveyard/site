import theme from "../theme";

export default () => {
    console.log(
`

%cSTOP!
%c
This is the developer console, which is usually used for testing the site. However, there are some dangerous commands that, when entered here, may reveal tokens that can be used to access your account.

If somebody told you to enter something in here, they're almost certainly trying to steal your account. Even Alles staff don't need you to do anything here. Ignore what they say, and if they told you on Alles, please block and report them to help make the community safer.

`,
        `color: ${theme.accent}; font-size: 40px;`, ``
    );
};