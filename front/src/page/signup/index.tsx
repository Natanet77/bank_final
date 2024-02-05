// import { useAuth } from "../../container/AuthContext";

import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import "./index.css";
import { BackButton } from "../../component/back-button";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setEmailIsValid] = useState(true);
  const [isPasswordValid, setPasswordIsValid] = useState(true);
  const [error, setError] = useState("");
  // const { login } = useAuth();
  // const navigate = useNavigate();

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
    // Define your password validation criteria here
    const minLength = 6;
    const hasUppercase = /[A-Z]/.test(password);
    // const hasSpecialChar = /[!@#$%^&*]/.test(password);

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
      setError("Enter email and password!");
    } else if (!email) {
      setError("Enter email!");
    } else if (!password) {
      setError("Enter password!");
    } else if (!isEmailValid) {
      setError("Enter e valid email!");
    } else if (!isPasswordValid) {
      setError("Minimum 6 symbols, 1 UpperCase");
    } else {
      try {
        const response = await fetch("http://localhost:4000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.status === 409) {
          // Handle the case where the email already exists
          const responseData = await response.json();
          console.log(responseData.error);
          console.error(responseData.error);
          setError(responseData.error);
        }

        if (response.ok) {
          // Registration successful, you can navigate to the next page
          const responseData = await response.json(); // Parse the JSON response

          console.log("Response Data:", responseData);

          // const user = responseData.user;
          // console.log("user:", user);
          // dispatch({ type: "LOGIN", payload: user });
          // console.log("dispatch: ", user);

          navigate("/signupConfirm");
        } else {
          // Handle registration errors
          console.error("Registration failed");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  return (
    <div className="signup-container">
      <BackButton />
      <form onSubmit={handleSubmit}>
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
          onChange={handleEmailChange}
          required
        />
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
