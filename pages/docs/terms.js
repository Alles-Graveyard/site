import Page from "../../components/Page";
import withAuth from "../../util/withAuth";
import {Box} from "@reactants/ui";

export default withAuth(
	props => (
		<Page
			title="Terms of Use"
			user={props.user}
			breadcrumbs={[
				{
					name: "Terms of Use"
				}
			]}
		>
			<Box>
				<Box.Content>
					<p>
						Hey! Thanks for actually taking the time to read this. I know it's
						long, but it's important that everyone understands what's okay and
						what isn't. We're not too big on rules, but we have to draw a line
						somewhere.
					</p>
					<p>
						You're not allowed to use any Alles services for spam, hateful,
						abusive, overly offensive or discriminatory content. We understand
						that everyone has a slightly different understanding of what this
						means, based on their political and personal views, but it's up to
						us what content stays on our platform. We reserve the right to
						remove any content for any reason.
					</p>
					<p>
						In order to keep Alles a place that everyone can enjoy, we ask that
						you tag political posts with #political, and things that may be less
						suitable for some audiences with #nsfw. Failure to do this may
						result in minor consequences, and your posts will be tagged by our
						moderators. You're also not allowed to use Alles to intentionally
						mislead people (such as scamming), or to do anything illegal. We
						take this very seriously and it could result in termination of your
						account.
					</p>
					<p>
						In most cases, we prefer not to suspend your account entirely.
						Instead, every user has a score that goes up when they positively
						contribute to the community, and down when they violate our rules.
						This score could affect what services you can access and how you can
						use them. We intentionally keep this score quite ambiguous and try
						not to state what affects it in order to prevent people from taking
						advantage of the system.
					</p>
					<p>
						We will generally not allow refunds for payments except when
						required to by law.
					</p>
					<p>
						If you find a bug, we'd appreciate it if you contact us about it.
						You can publicly disclose it on our platform, or create an issue on
						our{" "}
						<a href="https://gh.alles.cx" className="normal">
							open-source repositories
						</a>
						. However, if you find a security vulnerability that could result in
						unauthorized people having access to accounts or non-public data,
						you must contact us via email to disclose it responsibly and
						privately, so others cannot abuse it. Failure to follow this
						procedure could result in serious consequences. Once we have
						resolved the issue, and if we deem it serious, then we may award you
						rubies or free Alles+.
					</p>
					<p>
						If you have any queries about these rules, feel free to email{" "}
						<strong>archie@alles.cx</strong>.
					</p>
				</Box.Content>
				<Box.Footer>Last updated on June 13th 2020</Box.Footer>
			</Box>
		</Page>
	),
	true
);
