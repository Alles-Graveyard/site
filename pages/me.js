import Page from "../layout/Page";
import withAuth from "../util/withAuth";
import theme from "../theme";
import config from "../config";
import {useState, useEffect, createRef} from "react";
import monYearDate from "../util/monYearDate";

import Input from "../components/Input";
import Button from "../components/Button";
import axios from "axios";

export default withAuth(props => {
  const [plusDate, setPlusDate] = useState();
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState({});
  const avatarUploadInput = createRef();

  useEffect(() => {
    if (props.user.plus.status === "active") {
      //Format Alles+ "since" date
      setPlusDate(monYearDate(new Date(props.user.plus.since)));
    }
  }, []);

  //Show Banner
  const showBanner = message => {
    setBanner({
      message,
      update: Math.random()
    });
  };

  //Upload Avatar
  const avatarUpload = e => {
    setLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);
    axios.post("/api/avatar", formData, {
      headers: {
        authorization: props.user.sessionToken
      }
    }).then(() => {
      showBanner("Avatar updated successfully.");
      setLoading(false);
    }).catch(error => {
      if (error.response) {
        const {err} = error.response.data;
        if (err === "avatarTooBig" || error.response.status === 413) showBanner("The avatar you selected is too big.");
        if (err === "badFileType") showBanner("Your avatar must be a png or jpg file.");
      } else {
        showBanner("Something went wrong.");
      }
      setLoading(false);
    });
  };

  //Change Password
  const changePassword = e => {
    e.preventDefault();
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    const newPassword2 = e.target.newPassword2.value;
    if (loading || !oldPassword || !newPassword || !newPassword2) return;
    setLoading(true);

    if (newPassword === newPassword2) {
      const form = e.target;
      axios.post(`${config.apiUrl}/password`, {
        oldPassword,
        newPassword
      }, {
        headers: {
          authorization: props.user.sessionToken
        }
      }).then(() => {
        showBanner("Password successfully updated.");
        setLoading(false);
        form.reset();
      }).catch(error => {
        if (error.response) {
          const {err} = error.response.data;
          if (err === "passwordRequirements") showBanner("Passwords must be between 6 and 128 characters long.");
          if (err === "oldPasswordIncorrect") showBanner("The old password you entered is incorrect.");
          if (err === "badPassword") showBanner("You can't change your password to this.");
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
    <Page title="My Account" header style={{background: theme.greyF}} banner={banner} user={props.user}>

      <section className="user">
        <img className="profilePicture" src={`https://avatar.alles.cx/user/${props.user.id}`} onClick={() => avatarUploadInput.current.click()} />
        <h1 className="name">{props.user.name}{props.user.plus.status === "active" ? <sup>+</sup> : <></>}</h1>
        <h2 className="username">@{props.user.username}</h2>

        <input
          type="file"
          ref={avatarUploadInput}
          style={{display: "none"}}
          accept="image/png, image/jpeg"
          onChange={avatarUpload}
          disabled={loading}
        />

        <div className="quickInfo">

          <div>
            <i className="fas fa-coins"></i>
            <p><b>{props.user.au}</b>au</p>
          </div>

          <div>
            <i className="fas fa-plus-circle"></i>
            <p>{props.user.plus.status === "active" ? (plusDate ? <>Since <b style={{whiteSpace: "nowrap"}}>{plusDate}</b></> : "Active") : props.user.plus.status === "expired" ? "Expired" : "Try Alles+"}</p>
          </div>

          <div>
            <i className="fas fa-gem"></i>
            <p><b>{props.user.rubies}</b> {props.user.rubies === 1 ? "Ruby" : "Rubies"}</p>
          </div>

        </div>
      </section>

      <section>
        <h1 className="sectionTitle">Security</h1>
        <div className="box">
          <h1>Change your Password</h1>
          <form onSubmit={changePassword}>
            <h2>Old Password</h2>
            <Input wide type="password" name="oldPassword" />
            <h2>New Password</h2>
            <Input wide type="password" name="newPassword" />
            <h2>Confirm New Password</h2>
            <Input wide type="password" name="newPassword2" />
            <Button wide disabled={loading}>Update Password</Button>
          </form>
        </div>
      </section>

      <style jsx>{`
        section {
          background: white;
          max-width: 600px;
          margin: 20px auto;
          border-radius: 10px;
          padding: 20px;
          box-sizing: border-box;
        }

        h1.sectionTitle {
          border-left: solid 5px;
          padding-left: 10px;
          transition: 0.1s;
        }

        section:hover h1.sectionTitle {
          border-color: ${theme.accent};
          padding-left: 15px;
        }

        section.user {
          margin-top: 100px;
          padding-top: 0;
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
          cursor: pointer;
          transition: border-radius 0.1s;
        }

        .profilePicture:hover {
          border-radius: 40%;
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
          width: 170px;
          padding: 10px;
          box-sizing: border-box;
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

        .box {
          border: solid 1px ${theme.borderGrey};
          border-radius: 10px;
          padding: 20px;
        }

        .box h1 {
          font-weight: 500;
          margin: 0;
          margin-bottom: 40px;
          font-size: 20px;
        }

        .box h2 {
          font-weight: 500;
          color: ${theme.grey4};
          margin: 0;
          margin-top: 20px;
          font-size: 18px;
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
});