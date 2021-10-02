import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import classes from "./SelectedFilm.module.css";

function SelectedFilm() {
  const [content, setContent] = useState({});
  const { selectedId } = useParams();

  useEffect(() => {
    fetch(`https://api.tvmaze.com/shows/${selectedId}`)
      .then((req) => req.json())
      .then((data) => setContent(data));
  }, [selectedId]);

  const summary = content.summary?.replace(/<[^>]+>/g, "");

  const rating = content.rating?.average || "Can't find rating";

  return (
    <div className={classes.wrapper}>
      <div className={classes["selected-table"]}>
        <div className={classes.itemHeader}>
          <h2>{content.name}</h2>
          <p>{rating}</p>
        </div>
        <div className={classes.about}>
          <img src={content.image?.original} alt={content.name} />
          <div className={classes.sideContent}>
            <div className={classes.genres}>
              <h3>Genres of show:</h3>
              <ul>
                {content.genres?.map((item, id) => (
                  <li key={id}>{item}</li>
                ))}
              </ul>
            </div>
            {summary && (
              <div>
                <h3>Summary</h3>
                <p>{summary}</p>
              </div>
            )}
            <p className={classes.link}>
              <a href={content.officialSite} target="_blank" rel="noreferrer">
                See on the official website
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectedFilm;
