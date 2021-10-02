import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../data/auth";
import { userInfoActions } from "../data/user-info";

import classes from "./MainHeader.module.css";

function MainHeader() {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);

  function logoutHandler() {
    setIsShow((prev) => !prev);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    dispatch(authActions.logout());
    dispatch(userInfoActions.clearUserInfo());
  }

  function ShowHandler() {
    setIsShow((prev) => !prev);
  }

  let showMenu = classes[""];
  let showBar = classes[""];

  if (isShow === true) {
    showMenu = classes["show"];
    showBar = classes["hideBar"];
  }

  function offMenuHandler() {
    if (isShow) {
      setIsShow((prev) => !prev);
    }
  }

  return (
    <>
      <div
        className={isShow ? classes["overlay"] : classes[""]}
        onClick={ShowHandler}
      ></div>
      <nav className={classes["main-nav"]}>
        <h2>VideoStreem</h2>
        <span
          id="trigger"
          className={`${classes.trigger} ${showBar}`}
          onClick={ShowHandler}
        >
          <i></i>
          <i></i>
          <i></i>
        </span>
        <ul className={`${classes["nav-list"]} ${showMenu}`}>
          <li>
            <NavLink
              to="/"
              onClick={offMenuHandler}
              activeClassName={classes.selected}
              exact
            >
              Movies
            </NavLink>
          </li>
          {isAuth && (
            <li>
              <NavLink
                to="/favorites"
                onClick={offMenuHandler}
                activeClassName={classes.selected}
              >
                Favorites
              </NavLink>
            </li>
          )}
          {!isAuth && (
            <li>
              <NavLink
                to="/login"
                onClick={offMenuHandler}
                activeClassName={classes.selected}
              >
                Login
              </NavLink>
            </li>
          )}
          {isAuth && (
            <li>
              <NavLink
                to="/user-account"
                onClick={offMenuHandler}
                activeClassName={classes.selected}
              >
                User Account
              </NavLink>
            </li>
          )}
          {isAuth && (
            <li>
              <NavLink
                activeClassName={classes.selected}
                to="/login"
                onClick={logoutHandler}
              >
                Logout
              </NavLink>
            </li>
          )}
          {isShow && (
            <li className={classes.btnLi}>
              <button className={classes.btn} onClick={ShowHandler}>
                Back
              </button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default MainHeader;
