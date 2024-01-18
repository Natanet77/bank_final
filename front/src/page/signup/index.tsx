import AuthContext from "../../container/AuthContext";

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import "./index.css";
import { BackButton } from "../../component/back-button";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        dispatch({ type: "LOGIN", payload: data });

        navigate("/signup-confirm");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("A user with the same name is already exist.");
    }
  };

  return (
    <div className="signup-container">
      <BackButton />
      <form onSubmit={handleSignUp}>
        <div className="signup-title">
          <h2>Sign up</h2>
          <p>Choose a registration method</p>
        </div>
        <label htmlFor="email">Email</label>
        <input
          className="email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          className="password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="link-p">
          Already have an account?{" "}
          <span className="link-a" onClick={() => navigate("/signin")}>
            Sign In
          </span>
        </p>
        <button type="submit">Continue</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SignupPage;
