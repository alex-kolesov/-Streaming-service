import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useEffect, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";

import MainHeader from "./components/MainHeader";
import Movies from "./pages/Movies";
import NotFound from "./pages/NotFound";
import Login from "./components/login/Login";
import Registration from "./components/login/Registration";
import { autoLogin } from "./data/auth";

import { authActions } from "./data/auth";
import { userInfoActions } from "./data/user-info";

const Favourite = React.lazy(() => import("./pages/Favourite"));
const UserPage = React.lazy(() => import("./pages/UserPage"));
const SelectedFilm = React.lazy(() =>
  import("./components/selectedFilm/SelectedFilm")
);

function calculateRemainingTime(expirationTime) {
  const currentTime = new Date().getTime();
  const adjExperationTime = new Date(expirationTime).getTime();
  const remainingTime = adjExperationTime - currentTime;
  return remainingTime;
}

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuth);

  const token = localStorage.getItem("token");
  const expirationTime = localStorage.getItem("expirationTime");
  const remainingTime = calculateRemainingTime(expirationTime);

  useEffect(() => {
    if (remainingTime < 10800 && !!token) {
      dispatch(authActions.logout());
      dispatch(userInfoActions.clearUserInfo());
      localStorage.removeItem("expirationTime");
      localStorage.removeItem("token");
    } else if (!!token) {
      dispatch(autoLogin(token));
    } else {
      localStorage.removeItem("expirationTime");
      localStorage.removeItem("token");
    }
  }, [dispatch, token, remainingTime]);

  return (
    <div>
      <MainHeader />
      <Suspense fallback={<p className="loadingMessage">Loading...</p>}>
        <Switch>
          <Route path="/" exact>
            <Movies />
          </Route>
          {isAuth && (
            <Route path="/user-account" exact>
              <UserPage />
            </Route>
          )}
          {isAuth && (
            <Route path="/favorites">
              <Favourite />
            </Route>
          )}
          <Route path="/login">
            {!isAuth && <Login />}
            {isAuth && <Redirect to="/" />}
          </Route>
          <Route path="/registration">
            {!isAuth && <Registration />}
            {isAuth && <Redirect to="/" />}
          </Route>
          <Route path="/movies/:selectedId" component={SelectedFilm}>
            <SelectedFilm />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
