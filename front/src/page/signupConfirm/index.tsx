import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../container/AuthContext";
import "./index.css";
import { saveSession, getTokenSession } from "../../script/session";
import { BackButton } from "../../component/back-button";

//
const SignupConfirmPage: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const { state, dispatch } = useAuth();

  const [values, setValues] = useState({
    code: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = state.email;
    console.log("code: ", code, "email:", email);

    if (!code) {
      setAlert("Enter the code you are recived");
    } else {
      const enteredCode: Number = Number(code);
      console.log(enteredCode);
      try {
        const response = await fetch("http://localhost:4000/signupConfirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: convertData(),
        });

        if (response.status === 409) {
          // 'Invalid code'
          const responseData = await response.json();
          console.error(responseData.error);
          setCode("");
          setAlert(responseData.error);
        }
        const data = await response.json();
        if (response.ok) {
          // Code confirmed
          const responseData = await response.json(); // Parse the JSON response
          console.log("Response OK responseData:", responseData);
          const user = responseData.user;
          // state.isConfirm = true;
          console.log("success", data.message);
          saveSession(data.session);
          // location.assign("/");
          // saveSession(data.session);
          // Dispatch the "LOGIN" action to update the state
          dispatch({ type: "LOGIN", payload: user });
          navigate("/balance");
        } else {
          console.log("error", data.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };
  const convertData = () => {
    return JSON.stringify({
      code: Number(values.code),
      token: getTokenSession(),
    });
  };

  return (
    <div className="signupConfirm-container">
      <form onSubmit={handleSubmit}>
        <BackButton />
        <div className="signupConfirm-title">
          <h2>Confirm account</h2>
          <p>Write the code you received</p>
        </div>
        {/* <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /> */}
        <label htmlFor="code">Code</label>
        <input
          className="text"
          type="text"
          id="code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setAlert("");
          }}
          required
        />
        <button type="submit">Confirm</button>
      </form>
      {alert && <p className="error">{alert}</p>}
    </div>
  );
};

export default SignupConfirmPage;
