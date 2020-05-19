import nextCookie from "next-cookies";
import axios from "axios";
import config from "../config";
import Router from "next/router";

export default (WrappedComponent, allowGuest) => {
	const Wrapper = props => {
		if (props.user || allowGuest) {
			return <WrappedComponent {...props} />;
		} else {
			return <p>Unauthorized</p>;
		}
	};

	Wrapper.getInitialProps = async ctx => {
		const user = await auth(ctx);

		// Unauthorized Redirect
		if (!user && !allowGuest) {
			const redirectUrl = `/login?redirect=${encodeURIComponent(
				ctx.req
					? "https://" + ctx.req.headers.host + ctx.req.url
					: window.location.href
			)}`;

			// https://github.com/zeit/next.js/blob/canary/examples/with-cookie-auth/utils/auth.js#L16
			if (typeof window === "undefined") {
				ctx.res.writeHead(302, {Location: redirectUrl});
				ctx.res.end();
			} else {
				Router.push(redirectUrl);
			}
			return {user: null};
		}

		// Child getIntialProps
		ctx.user = user;
		const childProps = WrappedComponent.getInitialProps
			? await WrappedComponent.getInitialProps(ctx)
			: {};

		// Return Props
		return {
			user,
			...childProps
		};
	};

	return Wrapper;
};

const auth = async ctx => {
	const {sessionToken} = nextCookie(ctx);
	if (!sessionToken) return;
	var apiReq;
	try {
		apiReq = await axios.get(`${config.apiUrl}/me`, {
			headers: {
				authorization: sessionToken
			}
		});
	} catch (err) {
		return;
	}

	return {
		sessionToken,
		...apiReq.data
	};
};
