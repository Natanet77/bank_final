import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../component/back-button";
import AuthContext from "../../container/AuthContext";
import "./index.css";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Sorry, the password is too simple");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      if (data.token) {
        dispatch({
          type: "LOGIN",
          payload: { token: data.token, user: data.user },
        });
        navigate("/balance");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError(e.type);
    }
  };

  return (
    <div className="signin-container">
      <BackButton />
      <form onSubmit={handleSignIn}>
        <div className="signin-title">
          <h2>Sign in</h2>
          <p>Select login method</p>
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

        {error && <div className="error">{error}</div>}

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
          Forgot your password?{" "}
          <span className="link-a" onClick={() => navigate("/recovery")}>
            Restore
          </span>
        </p>

        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default SignInPage;
