import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./data/store";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
