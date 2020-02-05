import Page from "../../layout/CardPage";
import { useState } from "react";
import router, { withRouter } from "next/router";
import Cookies from "js-cookie";
import config from "../../config";
import axios from "axios";

import Input from "../../components/Input";
import Button from "../../components/Button";
import theme from "../../theme";

const activationPage = props => {
	const [formError, setFormError] = useState("");
	const [formLoading, setFormLoading] = useState(false);

	return (
		<Page title="Activate your Account" logo>
			<h1>Account Activation</h1>
			{props.reservation ? (
				<form
					onSubmit={e => {
						e.preventDefault();
						setFormError("");
						const password = e.target.password.value;
						if (!password || formLoading) return;
						setFormLoading(true);
						axios
							.post(`${config.apiUrl}/reservation`, {
								password,
								code: props.reservation.code
							})
							.then(res => {
								Cookies.set("sessionToken", res.data.token);
								router.push("/");
							})
							.catch(() => {
								setFormError("Something went wrong.");
								setFormLoading(false);
							});
					}}
				>
					<Input wide value={props.reservation.username} readOnly />
					<Input wide name="password" placeholder="Password" type="password" />
					<Button disabled={formLoading} wide>
						Activate
					</Button>
				</form>
			) : (
				<p>The specified reservation code is invalid.</p>
			)}
			{formError ? <p style={{ color: theme.error }}>{formError}</p> : <></>}
		</Page>
	);
};

activationPage.getInitialProps = async ctx => {
	const reservation = await getReservation(ctx.query.code);
	return {
		reservation: reservation ? reservation : null
	};
};

const getReservation = async code => {
	var apiReq;
	try {
		apiReq = await axios.get(
			`${config.apiUrl}/reservation?code=${encodeURIComponent(code)}`
		);
	} catch (err) {
		return;
	}

	return apiReq.data;
};

export default withRouter(activationPage);
