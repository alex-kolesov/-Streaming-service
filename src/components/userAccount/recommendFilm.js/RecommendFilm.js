import { Link } from "react-router-dom";

import classes from "./RecommendFilm.module.css";

function RecommendFilm(props) {
  function deleteHandler() {
    props.onDelete(props.id);
  }

  return (
    <div className={classes["user-table"]}>
      <img src={props.img} alt={props.name} />
      <div>{props.name}</div>
      <div className={classes.buttons}>
        <Link to={`/movies/${props.id}`}>Details</Link>
        <button onClick={deleteHandler}>Delete</button>
      </div>
    </div>
  );
}

export default RecommendFilm;
