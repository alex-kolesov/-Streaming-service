import reactDom from "react-dom";
import { useSelector } from "react-redux";
import FilmRecommend from "./FilmRecommend";

import classes from "./FilmsRecommendations.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onBack}></div>;
};

const FilmsOverlay = (props) => {
  const favoriteMovies = useSelector((state) => state.userInfo.favoriteMovies);

  function sendMovieHandler(movie) {
    props.onSend(movie);
  }

  return (
    <div className={classes.filmsOverlay}>
      <p>My Favorite Films:</p>
      <ul className={classes.recommedationTable}>
        {favoriteMovies.length > 0 ? (
          favoriteMovies.map((movie, id) => (
            <li key={id}>
              <FilmRecommend
                movie={movie}
                img={
                  movie.show?.image?.medium ||
                  movie.image?.medium || <div>can't find img</div>
                }
                name={movie.show?.name || movie.name}
                onSend={sendMovieHandler}
              />
            </li>
          ))
        ) : (
          <div>You don't have any favorite movie</div>
        )}
      </ul>
      <button onClick={props.onBack} className={classes.backBtn}>Back</button>
    </div>
  );
};

const FilmRecommendations = (props) => {
  return (
    <div>
      {reactDom.createPortal(
        <Backdrop onBack={props.onBack} />,
        document.getElementById("backdrop-root")
      )}
      {reactDom.createPortal(
        <FilmsOverlay onSend={props.onSend} onBack={props.onBack} />,
        document.getElementById("overlay-root")
      )}
    </div>
  );
};

export default FilmRecommendations;
