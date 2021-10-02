import { createSlice } from "@reduxjs/toolkit";

const showSlice = createSlice({
  name: "showSlice",
  initialState: { likedShows: {} },
  reducers: {
    fetchShow(state, action) {
      state.likedShows = action.payload;
    },
    likeShow(state, action) {
      const showId = action.payload?.show?.id || action.payload.id;
      if (state.likedShows[`id-${showId}`]) {
        state.likedShows[`id-${showId}`]++;
      } else {
        state.likedShows[`id-${showId}`] = 1;
      }
    },
    unlikeShow(state, action) {
      const showId = action.payload?.show?.id || action.payload.id;
      if (state.likedShows[`id-${showId}`] === 1) {
        delete state.likedShows[`id-${showId}`];
      } else {
        state.likedShows[`id-${showId}`]--;
      }
    },
  },
});

export const getInitialData = () => {
  return async (dispatch) => {
    const requst = await fetch(
      "https://streaming-service-93241-default-rtdb.firebaseio.com/likedShows.json"
    );
    const data = await requst.json();
    if (data) {
      dispatch(likedShowsActions.fetchShow(data.shows));
    }
    return data?.shows || {};
  };
};

export const sendLikedShow = (shows) => {
  return async (dispatch) => {
    fetch(
      "https://streaming-service-93241-default-rtdb.firebaseio.com/likedShows.json",
      {
        method: "PATCH",
        body: JSON.stringify({
          shows,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };
};

export const likedShowsActions = showSlice.actions;

export default showSlice.reducer;
