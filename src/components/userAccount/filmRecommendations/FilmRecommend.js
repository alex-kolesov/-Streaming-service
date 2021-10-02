import classes from './FilmRecommend.module.css'

function FilmRecommend(props) {
  function sendMovieHandler() {
    props.onSend(props.movie);
  }

  return (
    <div className={classes['show-table']}>
      <div>
        <img src={props.img} alt={props.name} />
        <p>{props.name}</p>
        <button onClick={sendMovieHandler}>Send</button>
      </div>
    </div>
  );
}

export default FilmRecommend;
