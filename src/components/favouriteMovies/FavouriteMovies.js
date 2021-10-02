import { useSelector } from "react-redux";
import React from "react";

import classes from "./FavouriteMovies.module.css";
import MovieItem from "../movie-item/MovieItem";

function FavouriteMovies() {
  const content = useSelector((state) => state.userInfo.favoriteMovies);

  let MovieItems = content.map((item) => {
    return (
      <MovieItem
        likes={item.likes}
        key={item.show?.id || item.id}
        name={item.show?.name || item.name}
        img={item.show?.image || item.image}
        score={item.score || item.rating?.average}
        data={item}
        isFavorite={true}
      />
    );
  });

  return (
    <div>
      <div className={classes["find-table"]}>
        <h2>Your Favorite Movies</h2>
      </div>
      <div className={classes.table}>{MovieItems}</div>
    </div>
  );
}

export default FavouriteMovies;
