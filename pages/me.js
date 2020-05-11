import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import config from "../config";
import {useState, createRef} from "react";
import axios from "axios";
import {Input, Button, Box, Spacer} from "@reactants/ui";
import WideLink from "../components/WideLink";
import Link from "next/link";
import {PlusCircle, Triangle} from "react-feather";

const page = props => {
	const [loading, setLoading] = useState(false);
	const [banner, setBanner] = useState();
	const avatarUploadInput = createRef();

	//Show Banner
	const showBanner = message => {
		setBanner({
			message,
			update: new Date().getTime()
		});
	};

	//Upload Avatar
	const avatarUpload = e => {
		setLoading(true);
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("avatar", file);
		e.target.value = null;
		axios
			.post(`${config.apiUrl}/avatar`, formData, {
				headers: {
					authorization: props.user.sessionToken
				}
			})
			.then(() => {
				location.reload();
				setLoading(false);
			})
			.catch(() => {
				showBanner("Something went wrong.");
				setLoading(false);
			});
	};

	//Update Profile
	const updateProfile = e => {
		e.preventDefault();
		const form = e.target;
		const fullname = form.name.value.trim();
		const nickname = form.nickname.value.trim();
		const about = form.about.value.trim();
		if (loading || !fullname || !nickname || !about) return;
		setLoading(true);

		axios
			.post(
				`${config.apiUrl}/updateProfile`,
				{
					name: fullname,
					nickname,
					about
				},
				{
					headers: {
						authorization: props.user.sessionToken
					}
				}
			)
			.then(() => {
				showBanner("Profile updated.");
				setLoading(false);
			})
			.catch(() => {
				showBanner("Something went wrong.");
				setLoading(false);
			});
	};

	//Change Password
	const changePassword = e => {
		e.preventDefault();
		const form = e.target;
		const oldPassword = form.oldPassword.value;
		const newPassword = form.newPassword.value;
		const newPassword2 = form.newPassword2.value;
		if (loading || !oldPassword || !newPassword || !newPassword2) return;
		setLoading(true);

		if (newPassword === newPassword2) {
			axios
				.post(
					`${config.apiUrl}/password`,
					{
						oldPassword,
						newPassword
					},
					{
						headers: {
							authorization: props.user.sessionToken
						}
					}
				)
				.then(() => {
					showBanner("Password successfully updated.");
					setLoading(false);
					form.reset();
				})
				.catch(error => {
					if (error.response) {
						const {err} = error.response.data;
						if (err === "passwordRequirements") {
							showBanner(
								"Passwords must be between 6 and 128 characters long."
							);
						} else if (err === "oldPasswordIncorrect") {
							showBanner("The old password you entered is incorrect.");
						} else if (err === "badPassword") {
							showBanner("You can't change your password to this.");
						} else {
							showBanner("Something went wrong.");
						}
					} else {
						showBanner("Something went wrong.");
					}
					setLoading(false);
				});
		} else {
			setLoading(false);
			showBanner("New passwords do not match");
		}
	};

	return (
		<Page
			title="My Account"
			banner={banner}
			user={props.user}
			breadcrumbs={[
				{
					name: "My Account"
				}
			]}
		>
			<Spacer y={8} />

			<Box
				style={{
					textAlign: "center"
				}}
			>
				<Box.Content>
					<div
						className="profilePicture"
						onClick={() => avatarUploadInput.current.click()}
					>
						<img className="overlay" src="/add-overlay.png" />
						<img
							className="picture"
							src={`https://avatar.alles.cx/u/${props.user.username}`}
						/>
					</div>

					<input
						type="file"
						ref={avatarUploadInput}
						style={{display: "none"}}
						accept="png, jpg, jpeg"
						onChange={avatarUpload}
						disabled={loading}
					/>

					<h1 className="name">
						{props.user.name}
						{props.user.plus ? <sup>+</sup> : <></>}
					</h1>
					<h2 className="username">@{props.user.username}</h2>

					<div className="quickInfo">
						<a href="https://plus.alles.cx">
							<div>
								<PlusCircle />
								<p>
									{props.user.plus ? (
										<>
											Alles+ is <b>Active</b>
										</>
									) : (
										<>
											Try <b>Alles+</b>
										</>
									)}
								</p>
							</div>
						</a>

						<Link href="/rubies">
							<a>
								<div>
									<Triangle />
									<p>
										<b>{props.user.rubies}</b>{" "}
										{props.user.rubies === 1 ? "Ruby" : "Rubies"}
									</p>
								</div>
							</a>
						</Link>
					</div>
				</Box.Content>
			</Box>

			<Spacer y={2} />

			<Box>
				<Box.Header>My Profile</Box.Header>
				<Box.Content>
					<form onSubmit={updateProfile}>
						<Input
							fluid
							label="Name"
							name="name"
							maxLength="50"
							placeholder="Jessica Adams"
							initialValue={props.user.name}
						/>
						<Spacer />
						<Input
							fluid
							label="Nickname"
							name="nickname"
							maxLength="50"
							placeholder="Jessica"
							initialValue={props.user.nickname}
						/>
						<Spacer />
						<Input
							fluid
							label="About"
							name="about"
							maxLength="125"
							placeholder="Hi, I'm Jessica! I'm 29 and work in the music industry, specifically modern classical music!"
							initialValue={props.user.about}
						/>
						<Spacer />
						<Button disabled={loading} style={{marginLeft: "auto"}} primary>
							Update
						</Button>
					</form>
				</Box.Content>
			</Box>

			<Spacer y={2} />

			<Box>
				<Box.Header>Apps &amp; Connections</Box.Header>
				<Box.Content>
					<WideLink href="https://pulsar.alles.cx/clients" basic>
						Pulsar Clients
					</WideLink>
				</Box.Content>
			</Box>

			<Spacer y={2} />

			<Box>
				<Box.Header>Change Password</Box.Header>
				<Box.Content>
					<form onSubmit={changePassword}>
						<Input.Password fluid label="Old Password" name="oldPassword" />
						<Spacer />
						<Input.Password fluid label="New Password" name="newPassword" />
						<Spacer />
						<Input.Password
							fluid
							label="Confirm New Password"
							name="newPassword2"
						/>
						<Spacer />
						<Button disabled={loading} style={{marginLeft: "auto"}} primary>
							Change Password
						</Button>
					</form>
				</Box.Content>
			</Box>

			<style jsx>{`
				section {
					background: white;
					width: 600px;
					max-width: 100%;
					margin: 20px auto;
					border-radius: 10px;
					padding: 20px;
					box-sizing: border-box;
					border: solid 1px var(--accents-2);
				}

				section.user {
					margin-top: 100px;
					padding-top: 0;
					text-align: center;
				}

				.profilePicture {
					border: solid 1px var(--accents-2);
					border-radius: 50%;
					height: 200px;
					width: 200px;
					position: relative;
					top: -100px;
					margin: 0 auto;
					margin-bottom: -100px;
					box-sizing: border-box;
					background: white;
					cursor: pointer;
					overflow: hidden;
				}

				.profilePicture img {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					transition: 0.1s;
				}

				.profilePicture:hover img.picture {
					filter: blur(1px);
				}

				.profilePicture img.overlay {
					z-index: 1;
					opacity: 0;
				}

				.profilePicture:hover img.overlay {
					opacity: 1;
				}

				h1.name {
					font-size: 30px;
					margin: 0;
					margin-top: 10px;
					font-weight: 500;
				}

				h2.username {
					font-size: 15px;
					font-weight: 400;
					margin: 0;
					margin-bottom: 10px;
					color: var(--primary);
				}

				.quickInfo {
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
				}

				.quickInfo div {
					width: 170px;
					padding: 10px;
					box-sizing: border-box;
					cursor: pointer;
					border-radius: 10px;
				}

				.quickInfo div:hover {
					background: #f7f7f7;
				}

				.quickInfo div p {
					margin: 0;
					margin-top: 10px;
					color: var(--accents-6);
				}

				.quickInfo div b {
					color: black;
				}

				@media screen and (max-width: 700px) {
					.quickInfo {
						display: block;
					}

					.quickInfo div {
						width: 100%;
					}
				}

				@media screen and (max-width: 450px) {
					.profilePicture {
						height: 120px;
						width: 120px;
						top: -60px;
						margin-bottom: -80px;
					}
				}
			`}</style>
		</Page>
	);
};

export default withAuth(page);
