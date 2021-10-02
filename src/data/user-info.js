import { createSlice } from "@reduxjs/toolkit";

const userInfo = createSlice({
  name: "userInfo",
  initialState: {
    userName: "",
    userEmail: "",
    userKey: "",
    favoriteMovies: [],
    friendsList: [],
    recommendedFilms: [],
    localId: "",
    likedMovies: [],
  },
  reducers: {
    addUser(state, actions) {
      state.userName = actions.payload.userName;
      state.userEmail = actions.payload.userEmail;
      state.userKey = actions.payload.userKey;
      state.favoriteMovies = actions.payload.favoriteMovies;
      state.friendsList = actions.payload.friendsList;
      state.recommendedFilms = actions.payload.recommendedFilms;
      state.localId = actions.payload.localId;
      state.likedMovies = actions.payload.likedMovies;
    },
    addLikedMovies(state, action) {
      state.likedMovies.push(action.payload);
    },
    removeLikedMovies(state, action) {
      state.likedMovies = state.likedMovies.filter(
        (item) => item !== action.payload
      );
    },
    addFavoriteMovies(state, action) {
      state.favoriteMovies.push(action.payload);
    },
    clearUserInfo(state) {
      state.userName = "";
      state.userEmail = "";
      state.userKey = "";
      state.favoriteMovies = [];
    },
    deleteFavorite(state, action) {
      state.favoriteMovies = state.favoriteMovies.filter((item) => {
        return (
          (item.show?.name ? item.show?.name : item.name) !== action.payload
        );
      });
    },
    addFriend(state, action) {
      state.friendsList.push(action.payload);
    },
    deleteFriend(state, action) {
      state.friendsList = state.friendsList.filter(
        (friend) => friend.key !== action.payload
      );
    },
    deleteRecommendation(state, action) {
      state.recommendedFilms = action.payload;
    },
  },
});

export const userInfoActions = userInfo.actions;

export default userInfo.reducer;
