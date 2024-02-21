import React, { useState, useEffect, useReducer, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../component/back-button";
import { useAuth } from "../../container/AuthContext";
import "./index.css";

const SignInPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isEmailValid, setEmailIsValid] = useState(true);
  const [isPasswordValid, setPasswordIsValid] = useState(true);
  const [alert, setAlert] = useState<string>("");
  const { state, dispatch } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newEmail: string = e.target.value;
    setEmail(newEmail);
    setEmailIsValid(validateEmail(newEmail));
  };

  const validatePassword = (password: string) => {
    const minLength = 6;
    const hasUppercase = /[A-Z]/.test(password);

    return password.length >= minLength && hasUppercase;
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newPassword: string = e.target.value;
    setPassword(newPassword);
    setPasswordIsValid(validatePassword(newPassword));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailIsValid(validateEmail(email));
    setPasswordIsValid(validatePassword(password));

    if (!email && !password) {
      setAlert("Enter email and password!");
    } else if (!email) {
      setAlert("Enter email!");
    } else if (!password) {
      setAlert("Enter password!");
    } else if (!isEmailValid) {
      setAlert("Enter e valid email!");
    } else if (!isPasswordValid) {
      setAlert("Minimum 6 symbols, 1 UpperCase");
    } else {
      try {
        const response = await fetch("http://localhost:4000/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const responseData = await response.json();

        if (response.status === 409) {
          setAlert(responseData.error);
        }

        if (response.ok) {
          const user = responseData.user;
          dispatch({ type: "LOGIN", payload: user });

          if (user) {
            navigate("/balance");
          }
        } else {
          console.error("Registration failed");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit}>
        <BackButton />
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
          onChange={handleEmailChange}
          required
        />

        {alert && <div className="error">{alert}</div>}

        <label htmlFor="password">Password</label>
        <input
          className="password"
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
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
      {alert && <p className="error">{alert}</p>}
    </div>
  );
};

export default SignInPage;
