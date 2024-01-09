import "./index.css";

import React from "react";

import { Link } from "react-router-dom";
import kefin from "./kefin.svg";

const WelcomePage = () => {
  return (
    <div className="welcome-page welcome">
      <h1 className="welcome-title">Hello!</h1>
      <p className="welcome-subtitle">Welcome to bank app</p>
      <img className="image" src={kefin} alt="Money" />

      <div className="welcome-space"></div>

      <div className="buttons">
        <Link className="button" to="/signup">
          Sign Up
        </Link>

        <Link className="button" to="/signin">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
