import "./index.css";

import React from "react";

import { Link } from "react-router-dom";

import Button from "../../component/button";
// import kerfin from "./kerfin.svg";

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <div className="welcome">
        <h1 className="welcome-title">Hello!</h1>
        <p className="welcome-subtitle">Welcome to bank app</p>
      </div>

      <div className="image"></div>
      <div className="welcome-space"></div>

      <div className="buttons">
        <Link className="button" to="/signup">
          <Button>Sign Up</Button>
        </Link>

        <Link className="button" to="/signin">
          <Button>Sign In</Button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
