import { createSlice } from "@reduxjs/toolkit";

import { userInfoActions } from "./user-info";
import { likedShowsActions } from "./likedShows";

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuth: false },
  reducers: {
    login(state) {
      state.isAuth = true;
    },
    logout(state) {
      state.isAuth = false;
    },
  },
});

export const registrUser = (userName, userEmail, userPassword) => {
  return async (dispatch) => {
    const user = {};
    let errorMessage;

    const sendAuthRequst = async () => {
      await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA62JRZeg45Z3oKMtzeQp_tRQ8R__e3sgA",
        {
          method: "POST",
          body: JSON.stringify({
            email: userEmail,
            password: userPassword,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authentication failed";
              if (data?.error?.message) {
                errorMessage = data.error.message;
              }
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          user.userData = data;
          user.userToken = data;
        })
        .catch((err) => {
          errorMessage = err.message;
        });

      if (errorMessage) {
        return errorMessage;
      }

      await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA62JRZeg45Z3oKMtzeQp_tRQ8R__e3sgA",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: user.userToken.idToken,
            displayName: userName,
            photoUrl: "",
            deleteAttribute: "PHOTO_URL",
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authentication failed";
              if (data?.error?.message) {
                errorMessage = data.error.message;
              }
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          user.userToken = data.localId;
        })
        .catch((err) => {
          errorMessage = err.message;
        });

      if (errorMessage) {
        return errorMessage;
      }
    };
    const sendRequst = async () => {
      const data = await fetch(
        "https://streaming-service-93241-default-rtdb.firebaseio.com/users.json?shallow=true",
        {
          method: "POST",
          body: JSON.stringify({
            name: userName,
            email: userEmail,
            localId: user.userToken,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((key) => {
          user.userKey = key.name;
          return key;
        });

      await fetch(
        `https://streaming-service-93241-default-rtdb.firebaseio.com/users/${data.name}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            userKey: user.userKey,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    };

    await sendAuthRequst();
    if (errorMessage) {
      return { errorMessage: errorMessage, status: "faild" };
    }
    await sendRequst();
    if (errorMessage) {
      return { errorMessage: errorMessage, status: "faild" };
    }

    dispatch(
      userInfoActions.addUser({
        userName: userName,
        userEmail: userEmail,
        userKey: user.userKey,
        favoriteMovies: [],
        friendsList: [],
        recommendedFilms: [],
        localId: user.userToken.localId,
        likedMovies: [],
      })
    );
    dispatch(authSlice.actions.login());

    return user.userData;
  };
};

export const autoLogin = (token) => {
  return async (dispatch) => {
    let authData;
    let errorMessage;

    fetch(
      "https://streaming-service-93241-default-rtdb.firebaseio.com/likedShows/shows.json"
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch(likedShowsActions.fetchShow(data || {}));
      })
      .catch((err) => {
        errorMessage = err.message;
      });

    await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyA62JRZeg45Z3oKMtzeQp_tRQ8R__e3sgA",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            errorMessage = "Authentication failed";
            if (data?.error?.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        data.users.map((el) => (authData = el));

        dispatch(authSlice.actions.login());
      })
      .catch((err) => {
        errorMessage = err.message;
      });

    const fetchData = async () => {
      const response = await fetch(
        "https://streaming-service-93241-default-rtdb.firebaseio.com/users.json"
      );
      const data = await response.json();
      return data;
    };

    const userData = await fetchData();

    const user = {};

    for (let key in userData) {
      if (userData[key].localId === authData.localId) {
        user.userKey = key;
        user.name = userData[key].name;
        user.email = userData[key].email;
        user.userFavoriteFilms = userData[key].favorite;
        user.friendsList = userData[key].friendsList;
        user.recommendedFilms = userData[key].recommendedFilms;
        user.likedMovies = userData[key].likedMovies;
      }
    }

    dispatch(
      userInfoActions.addUser({
        userName: user.name,
        userEmail: user.email,
        userKey: user.userKey,
        favoriteMovies: user.userFavoriteFilms ? user.userFavoriteFilms : [],
        friendsList: user.friendsList ? user.friendsList : [],
        recommendedFilms: user.recommendedFilms ? user.recommendedFilms : [],
        localId: userData.localId,
        likedMovies: user.likedMovies ? user.likedMovies : [],
      })
    );
  };
};

export const checkUser = (userEmail, userPassword) => {
  return async (dispatch) => {
    const user = {};
    let errorMessage;

    const fetchData = async () => {
      const response = await fetch(
        "https://streaming-service-93241-default-rtdb.firebaseio.com/users.json"
      );
      const data = await response.json();
      return data;
    };

    const fetchAuthData = async () => {
      await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA62JRZeg45Z3oKMtzeQp_tRQ8R__e3sgA",
        {
          method: "POST",
          body: JSON.stringify({
            email: userEmail,
            password: userPassword,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authentication failed";
              if (data?.error?.message) {
                errorMessage = data.error.message;
              }
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          user.authData = data;

          dispatch(authSlice.actions.login());
        })
        .catch((err) => {
          errorMessage = err.message;
        });
    };

    await fetchAuthData();

    if (errorMessage) {
      return { errorMessage: errorMessage, status: "faild" };
    }

    const userData = await fetchData();

    for (let key in userData) {
      if (userData[key].localId === user.authData.localId) {
        user.userKey = key;
        user.userFavoriteFilms = userData[key].favorite;
        user.friendsList = userData[key].friendsList;
        user.recommendedFilms = userData[key].recommendedFilms;
        user.likedMovies = userData[key].likedMovies;
      }
    }

    dispatch(
      userInfoActions.addUser({
        userName: user.authData.displayName,
        userEmail: user.authData.email,
        userKey: user.userKey,
        favoriteMovies: user.userFavoriteFilms ? user.userFavoriteFilms : [],
        friendsList: user.friendsList ? user.friendsList : [],
        recommendedFilms: user.recommendedFilms ? user.recommendedFilms : [],
        localId: userData.localId,
        likedMovies: user.likedMovies ? user.likedMovies : [],
      })
    );
    return user.authData;
  };
};

export const addFavorite = (name, email, movies, key, existedFilms) => {
  return async (dispatch) => {
    const sendRequst = async () => {
      await fetch(
        `https://streaming-service-93241-default-rtdb.firebaseio.com/users/${key}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name,
            email,
            favorite: movies,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    };
    await sendRequst();
  };
};

export const deleteFevorite = (movies, key) => {
  return async (dispatch) => {
    const sendRequst = async () => {
      await fetch(
        `https://streaming-service-93241-default-rtdb.firebaseio.com/users/${key}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            favorite: movies,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    };
    await sendRequst();
  };
};

export const addFriend = (friends, key) => {
  return async (dispatch) => {
    const sendRequst = async () => {
      await fetch(
        `https://streaming-service-93241-default-rtdb.firebaseio.com/users/${key}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            friendsList: friends,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    };

    await sendRequst();
  };
};

export const sendRecommendedFilms = (movie, key) => {
  return async (dispatch) => {
    const sendRequst = async () => {
      const requst = await fetch(
        `https://streaming-service-93241-default-rtdb.firebaseio.com/users/${key}.json`
      );
      const oldData = await requst.json();

      await fetch(
        `https://streaming-service-93241-default-rtdb.firebaseio.com/users/${key}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            recommendedFilms: [...(oldData.recommendedFilms || []), movie],
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    };

    await sendRequst();
  };
};

export const updateRecommendedFilms = (movies, key) => {
  return async (dispatch) => {
    const sendRequst = async () => {
      await fetch(
        `https://streaming-service-93241-default-rtdb.firebaseio.com/users/${key}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            recommendedFilms: movies,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    };

    await sendRequst();
  };
};

export const sendUserLikedShow = (likedMovies, key) => {
  return async (dispatch) => {
    const sendRequst = async () => {
      await fetch(
        `https://streaming-service-93241-default-rtdb.firebaseio.com/users/${key}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            likedMovies: likedMovies,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    };

    await sendRequst();
  };
};

export const authActions = authSlice.actions;

export default authSlice.reducer;
