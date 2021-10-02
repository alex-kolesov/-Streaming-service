import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";

import { checkUser } from "../../data/auth";
import classes from "./Login.module.css";
import { authActions } from "../../data/auth";
import { userInfoActions } from "../../data/user-info";

let logoutTimer;

function Login() {
  const dispatch = useDispatch();
  const inputPassword = useRef();
  const inputEmail = useRef();
  const [err, serErr] = useState(null);

  async function sumbitHandler(event) {
    event.preventDefault();
    const authData = await dispatch(
      checkUser(inputEmail.current.value, inputPassword.current.value)
    );

    if (authData.status === "faild") {
      serErr(authData.errorMessage);
    } else {
      serErr(null);
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
      <div className={classes["login-table"]}>
        <h2>Member Login</h2>
        <form
          action=""
          onSubmit={sumbitHandler}
          className={classes["login-form"]}
        >
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={inputEmail} />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={inputPassword} />
          {err && <p className={classes.errorMessage}>{err}</p>}
          <button>Enter</button>
        </form>
        <Link to="/registration">Create your Account &#10142;</Link>
      </div>
    </div>
  );
}

export default Login;
