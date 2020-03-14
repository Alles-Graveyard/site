import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import theme from "../theme";
import Link from "next/link";

const people = props => {
	return (
		<Page header user={props.user} title="Users">
			{props.users.map(u => (
				<Link href="/u/[id]" as={`/u/${u.username}`} key={u.id}>
					<a className="user">
						<div className="left">
							<img src={`https://avatar.alles.cx/user/${u.id}`} />
							<h1>
								{u.name}
								{props.user.plus ? <sup>+</sup> : <></>}
							</h1>
						</div>
						<h2>@{u.username}</h2>
					</a>
				</Link>
			))}

			<style jsx>{`
				.user {
					display: flex;
					background: #ffffff;
					padding: 20px;
					margin: 20px 0;
					border-radius: 20px;
					border: solid 1px ${theme.borderGrey};
				}

				.user h1 {
					font-size: 20px;
					font-weight: 500;
					margin: auto 0;
				}

				.user h2 {
					font-size: 15px;
					font-weight: 400;
					margin: auto 0;
					color: ${theme.grey4};
				}

				.user img {
					height: 30px;
					width: 30px;
					border-radius: 50%;
					margin-right: 10px;
				}

				.user .left {
					display: flex;
					flex-grow: 1;
				}
			`}</style>
		</Page>
	);
};

people.getInitialProps = ctx => {
	return {
		users: [
			{
				id: "00000000-0000-0000-0000-000000000000",
				username: "archie",
				name: "Archie Baer",
				plus: true
			},
			{
				id: "b990537f-8037-49b7-a9df-b4b2a36b7911",
				username: "dante",
				name: "Dante Issaias",
				plus: true
			}
		]
	};
};

export default withAuth(people);
