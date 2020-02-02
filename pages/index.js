import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import theme from "../theme";
import {useState, useEffect} from "react";
import monYearDate from "../util/monYearDate";

export default withAuth(props => {
  const [plusDate, setPlusDate] = useState();

  useEffect(() => {
    if (props.user.plus.status === "active") {
      //Format Alles+ "since" date
      setPlusDate(monYearDate(new Date(props.user.plus.since)));
    }
  }, []);

  return (
    <Page title="My Account" header style={{background: theme.greyF}} user={props.user}>

      <section className="user">
        <img className="profilePicture" src="https://pbs.twimg.com/profile_images/1180922399790944257/3lC1YOEY_400x400.png" />
        <h1 className="name">{props.user.name}{props.user.plus.status === "active" ? <sup>+</sup> : <></>}</h1>
        <h2 className="username">@{props.user.username}</h2>

        <div className="quickInfo">

          <div>
            <i className="fas fa-coins"></i>
            <p><b>{props.user.au}</b>au</p>
          </div>

          <div>
            <i className="fas fa-plus-circle"></i>
            <p>{props.user.plus.status === "active" ? (plusDate ? <>Since <b>{plusDate}</b></> : "Active") : props.user.plus.status === "expired" ? "Expired" : "Try Alles+"}</p>
          </div>

          <div>
            <i className="fas fa-gem"></i>
            <p><b>{props.user.rubies}</b> {props.user.rubies === 1 ? "Ruby" : "Rubies"}</p>
          </div>

        </div>
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
          font-weight: 400;
          margin: 0;
          margin-bottom: 10px;
          color: ${theme.accent};
        }

        .quickInfo {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }

        .quickInfo div {
          min-width: 150px;
          padding: 10px;
        }

        .quickInfo div:hover {
          background: #f0f0f080;
        }

        .quickInfo div i {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .quickInfo div p {
          margin: 0;
          color: ${theme.grey4};
        }

        .quickInfo div b {
          color: black;
        }
      `}</style>
    </Page>
  );
});