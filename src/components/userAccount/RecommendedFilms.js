import { useSelector, useDispatch } from "react-redux";
import RecommendFilm from "./recommendFilm.js/RecommendFilm";
import { userInfoActions } from "../../data/user-info";
import { updateRecommendedFilms } from "../../data/auth";

import classes from "./RecommendedFilms.module.css";

function RecommendedFilms() {
  const dispatch = useDispatch();
  const recommendedMovies = useSelector(
    (state) => state.userInfo.recommendedFilms
  );
  const userKey = useSelector((state) => state.userInfo.userKey);

  function deleteHandler(showId) {
    const newFavorite = recommendedMovies.filter((favorite) => {
      return (favorite.show?.id ? favorite.show?.id : favorite.id) !== showId;
    });
    dispatch(userInfoActions.deleteRecommendation(newFavorite));
    dispatch(updateRecommendedFilms(newFavorite, userKey));
  }

  return (
    <div className={classes.recommendTable}>
      <ul>
        {recommendedMovies.map((movie, id) => (
          <li key={id}>
            <RecommendFilm
              img={
                movie.show?.image?.medium ||
                movie.image?.medium || <div>can't find img</div>
              }
              name={movie.show?.name || movie.name}
              id={movie.show?.id || movie.id}
              onDelete={deleteHandler}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecommendedFilms;
