import reactDom from "react-dom";
import React, { useState } from "react";

import classes from "./FindMovie.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onBack}></div>;
};

function FindOverlay(props) {
  const [findData, setFindData] = useState("");
  const [currentFind, setCurrentFind] = useState("closeName");

  function submitHandler(event) {
    event.preventDefault();

    if (findData.length === 0) {
      return;
    }

    props.finderHandler({
      currentFind: currentFind,
      findValue: findData,
    });
  }

  function findDataHandler(value) {
    setFindData(value.target.value);
  }

  let finder = (
    <input
      placeholder="by close name"
      value={findData}
      onChange={findDataHandler}
    ></input>
  );

  if (currentFind === "exactName") {
    finder = (
      <input
        placeholder="by exact name"
        value={findData}
        onChange={findDataHandler}
      ></input>
    );
  }

  if (currentFind === "sortName") {
    let genres = [];
    for (let key in props.sortedData) {
      genres.push(key);
    }
    finder = (
      <select
        size="5"
        onChange={(event) => {
          findDataHandler(event);
        }}
      >
        {genres.map((genre, id) => {
          return (
            <option key={id} value={genre}>
              {genre}
            </option>
          );
        })}
      </select>
    );
  }

  return (
    <div
      className={`${classes.filmsOverlay} ${
        currentFind === "sortName" ? classes.filmsOverlaySort : ""
      }`}
    >
      <div className={classes["find-table"]}>
        <form
          action=""
          className={classes["find-form"]}
          onSubmit={submitHandler}
        >
          <label htmlFor="findMovie">Choose mode for finding</label>
          <select
            id="findMovie"
            onChange={(event) => {
              setCurrentFind(event.target.value);
            }}
            value={currentFind}
          >
            <option value="closeName">Find by close Name</option>
            <option value="exactName">Find by exact Name</option>
            <option value="sortName">Sort by gengre</option>
          </select>
          {finder}
          <div className={classes.btns}>
            <button type="button" onClick={props.closeFinder}>
              Back
            </button>
            <button>Find</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FindMovie(props) {
  return (
    <div>
      {reactDom.createPortal(
        <Backdrop onBack={props.closeFinder} />,
        document.getElementById("backdrop-root")
      )}
      {reactDom.createPortal(
        <FindOverlay
          finderHandler={props.finderHandler}
          closeFinder={props.closeFinder}
          sortedData={props.sortedData}
        />,
        document.getElementById("overlay-root")
      )}
    </div>
  );
}

export default React.memo(FindMovie);
