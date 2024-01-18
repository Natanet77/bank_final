import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../container/AuthContext";
import "./index.css";
import { BackButton } from "../../component/back-button";

const SignupConfirmPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/signup-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (data.success) {
        dispatch({
          type: "LOGIN",
          payload: { token: data.token, user: data.user },
        });
        navigate("/balance");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleConfirm}>
        <BackButton />
        <div className="signup-title">
          <h2>Confirm account</h2>
          <p>Write the code you received</p>
        </div>
        <label htmlFor="code">Code</label>
        <input
          className="text"
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Confirm</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SignupConfirmPage;
