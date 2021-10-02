import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import userReducer from "./user-info";
import likedShowsReducer from "./likedShows";

const store = configureStore({
  reducer: {
    auth: authReducer,
    userInfo: userReducer,
    likedShows: likedShowsReducer,
  },
});

export default store;
