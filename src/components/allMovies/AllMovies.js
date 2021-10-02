import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import MovieItem from "../movie-item/MovieItem";
import FindMovie from "../findMovie/FindMovie";
import classes from "./AllMovies.module.css";
import FindIcon from "../../icons/FindIcon";
import { getInitialData } from "../../data/likedShows";

function AllMovies() {
  const dispatch = useDispatch();
  const [content, setContent] = useState([]);
  const [isFinding, setIsFinding] = useState(false);
  const [searchShow, setSeatchShow] = useState(
    "https://api.tvmaze.com/shows?page=0"
  );
  const [sortedContent, setSortedContent] = useState({});
  const [errMessage, setErrMessage] = useState(null);

  useEffect(() => {
    const sendRequst = async () => {
      const showLike = await dispatch(getInitialData());
      const sortedData = {};
      fetch(searchShow)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          let showData;
          if (Array.isArray(data)) {
            showData = data;
          } else {
            showData = [data];
          }
          showData.forEach((item) => {
            if (showLike.hasOwnProperty(item.id)) {
              item.likes = showLike[item.id];
            }
            item.genres?.forEach((gengre) => {
              if (sortedData.hasOwnProperty(gengre)) {
                sortedData[gengre].push(item);
              } else {
                sortedData[gengre] = [item];
              }
            });
          });
          setSortedContent(sortedData);
          setContent(showData);
        })
        .catch((err) => {
          setErrMessage("Sorry. Something went wrong");
        });
    };
    sendRequst();
  }, [searchShow, dispatch]);

  function findHandler() {
    setIsFinding(true);
  }

  function finderHandler(value) {
    setIsFinding(false);
    if (value.currentFind === "closeName") {
      setSeatchShow(`https://api.tvmaze.com/search/shows?q=${value.findValue}`);
    } else if (value.currentFind === "exactName") {
      setSeatchShow(
        `https://api.tvmaze.com/singlesearch/shows?q=${value.findValue}`
      );
    } else if (value.currentFind === "sortName") {
      setContent(sortedContent[value.findValue]);
    }
  }

  function closeFinder() {
    setIsFinding(false);
  }

  let MovieItems = content.map((item) => {
    return (
      <MovieItem
        likes={item.likes}
        key={item.show?.id || item.id}
        name={item.show?.name || item.name}
        img={item.show?.image || item.image}
        score={item.score || item.rating?.average}
        data={item}
      />
    );
  });

  return (
    <div>
      <div className={classes["find-table"]}>
        <h2>Any movies that you want!</h2>
        {!isFinding && (
          <button onClick={findHandler} className={classes.findBtn}>
            <FindIcon />
          </button>
        )}
        {isFinding && (
          <FindMovie
            sortedData={sortedContent}
            finderHandler={finderHandler}
            closeFinder={closeFinder}
          />
        )}
      </div>
      {errMessage && <p className="loadingMessage">{errMessage}</p>}
      <div className={classes.table}>{MovieItems}</div>
    </div>
  );
}

export default AllMovies;
