import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import { addFavorite, deleteFevorite } from "../../data/auth";
import { userInfoActions } from "../../data/user-info";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { sendLikedShow } from "../../data/likedShows";
import { sendUserLikedShow } from "../../data/auth";
import { likedShowsActions } from "../../data/likedShows";
import classes from "./MovieItem.module.css";

function MovieItem(props) {
  const [addUpdate, setAddUpdate] = useState(false);
  const [addedToFavorite, setAddedToFavorite] = useState(false);
  const [likeShow, setLikeShow] = useState(false);

  const dispatch = useDispatch();

  const isAuth = useSelector((state) => state.auth.isAuth);
  const userName = useSelector((state) => state.userInfo.userName);
  const userEmail = useSelector((state) => state.userInfo.userEmail);
  const favoriteMovies = useSelector((state) => state.userInfo.favoriteMovies);
  const userKey = useSelector((state) => state.userInfo.userKey);
  const likedShows = useSelector((state) => state.likedShows.likedShows);
  const userLikedMovies = useSelector((state) => state.userInfo.likedMovies);

  const showName = props.data.show?.name
    ? props.data.show?.name
    : props.data.name;

  const showId = props.data.show?.id || props.data.id;

  async function favoriteHadnler() {
    await dispatch(userInfoActions.addFavoriteMovies(props.data));
    setAddedToFavorite(true);
    setAddUpdate(true);
  }

  async function deleteFavoriteHadnler() {
    dispatch(
      deleteFevorite(
        favoriteMovies.filter((item) => {
          return item.show?.id || item.id !== showId;
        }),
        userKey
      )
    );
    dispatch(userInfoActions.deleteFavorite(showName));
    setAddedToFavorite(false);
  }

  async function likeHandler() {
    await dispatch(likedShowsActions.likeShow(props.data));
    await dispatch(userInfoActions.addLikedMovies(showId));
    setLikeShow(true);
  }

  async function unlikeHandler() {
    await dispatch(likedShowsActions.unlikeShow(props.data));
    await dispatch(userInfoActions.removeLikedMovies(showId));
    setLikeShow(true);
  }

  useEffect(() => {
    if (likeShow) {
      dispatch(sendLikedShow(likedShows));
      dispatch(sendUserLikedShow(userLikedMovies, userKey));
      setLikeShow(false);
    }
  }, [likeShow]);

  useEffect(() => {
    if (addUpdate) {
      dispatch(addFavorite(userName, userEmail, favoriteMovies, userKey));
      setAddUpdate(false);
    }
  }, [addUpdate]);

  useEffect(() => {
    for (let movie in favoriteMovies) {
      if (
        (favoriteMovies[movie].show?.name
          ? favoriteMovies[movie].show?.name
          : favoriteMovies[movie].name) === showName
      ) {
        setAddedToFavorite(true);
      }
    }
  }, [favoriteMovies]);

  return (
    <div className={classes.table}>
      <LazyLoadImage src={props.img?.original} alt={props.name} />
      <div className={classes.mainText}>
        <div className={classes.header}>
          <p>{props.name}</p>
          {likedShows?.hasOwnProperty([`id-${showId}`]) &&
            likedShows[`id-${showId}`] && (
              <div className={classes.likes}>
                {likedShows[`id-${showId}`] === 1 ? (
                  <p>{likedShows[`id-${showId}`]} Like</p>
                ) : (
                  <p>{likedShows[`id-${showId}`]} Likes</p>
                )}
              </div>
            )}
        </div>
        <div className={classes.buttons}>
          {!addedToFavorite && isAuth && (
            <button onClick={favoriteHadnler}>Add to Favorite</button>
          )}
          {addedToFavorite && isAuth && (
            <button onClick={deleteFavoriteHadnler}>Delete</button>
          )}
          {isAuth && !userLikedMovies.includes(showId) && (
            <button onClick={likeHandler}>Like</button>
          )}
          {isAuth && userLikedMovies.includes(showId) && (
            <button onClick={unlikeHandler}>Unlike</button>
          )}
          <Link to={`/movies/${showId}`}>Details</Link>
        </div>
      </div>
    </div>
  );
}

export default MovieItem;
