import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import theme from "../theme";

export default withAuth(props => {
  return (
    <Page title="My Account" header style={{background: theme.greyF}} user={props.user}>

      <section className="user">
        <img className="profilePicture" src="https://pbs.twimg.com/profile_images/1180922399790944257/3lC1YOEY_400x400.png" />
        <h1 className="name">{props.user.name}</h1>
        <h2 className="username">@{props.user.username}</h2>
      </section>

      <style jsx>{`
        section.user {
          background: white;
          max-width: 600px;
          margin: 100px auto 20px auto;
          border-radius: 10px;
          padding: 20px;
          padding-top: 0;
          box-sizing: border-box;
          text-align: center;
          overflow: unset hidden;
        }

        .profilePicture {
          border: solid 10px white;
          border-radius: 50%;
          height: 200px;
          width: 200px;
          position: relative;
          top: -100px;
          margin-bottom: -100px;
          box-sizing: border-box;
          background: white;
        }

        h1.name {
          font-size: 30px;
          margin: 0;
          margin-top: 10px;
          font-weight: 500;
        }

        h2.username {
          font-size: 15px;
          font-weight: 300;
          margin: 0;
          margin-bottom: 10px;
        }
      `}</style>
    </Page>
  );
});