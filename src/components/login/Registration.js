import { useDispatch } from "react-redux";
import { useRef, useState } from "react";

import { registrUser } from "../../data/auth";
import classes from "./Login.module.css";

import { authActions } from "../../data/auth";
import { userInfoActions } from "../../data/user-info";

let logoutTimer;

function Registration() {
  const [err, setErr] = useState(null);

  const dispatch = useDispatch();
  const inputName = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();

  async function sumbitHandler(event) {
    event.preventDefault();
    if (inputName.current.value.length < 4) {
      setErr("Name must be more than 3 letters");
      return;
    }
    const authData = await dispatch(
      registrUser(
        inputName.current.value,
        inputEmail.current.value,
        inputPassword.current.value,
        []
      )
    );

    if (authData.status === "faild") {
      setErr(authData.errorMessage);
      console.log(authData.errorMessage);
    } else {
      localStorage.setItem("token", authData.idToken);

      const expirationTime = new Date(
        new Date().getTime() + +authData.expiresIn * 1000
      );

      localStorage.setItem("expirationTime", expirationTime.toISOString());

      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }

      logoutTimer = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationTime");
        dispatch(authActions.logout());
        dispatch(userInfoActions.clearUserInfo());
      }, 3600000);
    }
  }

  return (
    <div className={classes["login-wrapper"]}>
      <div className={`${classes["login-table"]} ${classes.registration}`}>
        <h2>Member Registration</h2>
        <form
          action=""
          onSubmit={sumbitHandler}
          className={classes["login-form"]}
        >
          <label htmlFor="name">User Name</label>
          <input type="text" id="name" ref={inputName} />
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={inputEmail} />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={inputPassword} />
          {err && <p className={classes.errorMessage}>{err}</p>}
          <button>Regisrt</button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
