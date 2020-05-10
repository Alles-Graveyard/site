export default () => {
	const color = getComputedStyle(document.documentElement).getPropertyValue(
		"--primary"
	);
	console.log(
		`

%cSTOP!
%c
This is the developer console, which is usually used for testing the site. However, there are some dangerous commands that, when entered here, may reveal tokens that can be used to access your account.

Unless you know what you're doing, you should close this, and if an Alles user told you to enter something here, you should report them. Even Alles staff members shouldn't need you to do anything. However, if you do know what you're doing, you should join our community of developers: https://dev.alles.cx

`,
		`color: ${color}; font-size: 40px;`,
		``
	);
};
