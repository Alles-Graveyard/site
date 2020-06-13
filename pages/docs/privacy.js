import Page from "../../components/Page";
import withAuth from "../../util/withAuth";
import {Box} from "@reactants/ui";

export default withAuth(
	props => (
		<Page
			title="Privacy Policy"
			user={props.user}
			breadcrumbs={[
				{
					name: "Privacy Policy"
				}
			]}
		>
			<Box>
				<Box.Content>
					<p>
						One of Alles' core values is protecting your privacy. We will never
						run ads that target and track you, we won't allow companies to
						misuse your data via our APIs, and we'll design our platform in a
						way to ensure that we don't exploit your data and profit from your
						every interaction.
					</p>
					<p>
						Like nearly all websites, we use cookies and similar technologies to
						keep you signed in. Essentially, when you sign in to Alles, our
						servers give you a special token, kind of like a library card, that
						your browser sends back with every request so we can ensure that we
						know who you are and don't confuse you with other users.
					</p>
					<p>
						We don't use any third party trackers or analytics tools, though we
						do use some third party services in specific places on our sites. On
						the registration page, we use Google's{" "}
						<a href="https://www.google.com/recaptcha" className="normal">
							reCAPTCHA
						</a>{" "}
						service to stop bots from making tons of accounts. Some data is sent
						to Google while you use this page, and it is subject to their{" "}
						<a href="https://www.google.com/policies/terms/" className="normal">
							Terms of Use
						</a>{" "}
						and{" "}
						<a
							href="https://www.google.com/policies/privacy/"
							className="normal"
						>
							Privacy Policy
						</a>
						.
					</p>
					<p>
						On your profile page, other users can see information such as your
						name, username, profile picture, rubies and follower count. If your
						account is public, they can also see your content such as posts.
						Only you can see a list of who follows you and who you follow. Your
						accounts are not publicly associated with each other, meaning you
						are free to create a secondary account to use anonymously, though we
						do not allow you to have multiple primary accounts.
					</p>
					<p>
						The only way that we allow third party services to access non-public
						information about your account is through our OAuth api. When an
						application needs to connect to your account, you will be taken to
						the "Sign in with Alles" page, and you can choose which account to
						use, and see what data it needs. Use of third party applications are
						likely subject to their own Terms of Service and Privacy Policies.
						You should make sure to read them before signing in with Alles.
					</p>
					<p>
						Your password is stored securely in our database, hashed with the{" "}
						<a href="https://www.npmjs.com/package/argon2" className="normal">
							Argon2 algorithm
						</a>
						. This means the only time we have access to your plain text
						password is when you are signing in, and we never store it in this
						form. You should never enter your password on any site other than
						alles.cx or its subdomains, and you should not give it to anyone,
						even Alles staff.
					</p>
					<p>
						As Alles' range of services grows, the way each part interacts with
						the others becomes more complicated. We've designed our platform in
						a way so that only select services have direct access to the
						database. Most services communicate with each other via internal
						APIs, and data for individual services are usually stored in their
						own database that only they have access to, instead of the
						centralised Alles database.
					</p>
					<p>
						Other than the first-party Alles email service, there is no email
						address tied directly to your account in the main Alles database. We
						may store your email address to send you emails about payments or
						newsletters. We will never provide your email address to any third
						party unless it is necessary for the operation of our services (eg.
						a payments processor), and you can unsubscribe from newsletters at
						any time.
					</p>
					<p>
						We handle your data in line with data protection laws such as GDPR.
						We are working on ways to make it easier for you to export and
						delete your data from our services. For now, if you have a request,
						you can contact us via email.
					</p>
					<p>
						Finally, we aim to be as transparent as possible. We value your
						trust about all else, and we take your security seriously, but
						things go wrong sometimes. Even if we merely suspect a data breach
						or security issue, we will keep you informed with the situation, and
						let you know if any of your information has been affected.
					</p>
					<p>
						If you have any concerns about this privacy policy, feel free to
						email <strong>archie@alles.cx</strong>.
					</p>
				</Box.Content>
				<Box.Footer>Last updated on June 13th 2020</Box.Footer>
			</Box>
		</Page>
	),
	true
);
