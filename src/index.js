import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
// import registerServiceWorker from "./registerServiceWorker";
import * as serviceWorker from "./serviceWorker";
// import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <Router basename="/secure_vms_web">
    <App />
  </Router>,
  document.getElementById("root")
);
serviceWorker.unregister();
// registerServiceWorker();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
