import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../container/AuthContext";
import "./index.css";
import { BackButton } from "../../component/back-button";

const SignupConfirmPage = () => {
  const [code, setCode] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { state, dispatch } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //const newCode: number = parseInt((e.target as HTMLInputElement).value, 10);
    const newCode = (e.target as HTMLInputElement).value;
    setCode(newCode);

    // const email = state.email;
    console.log("code: ", code);

    if (!code) {
      setAlert("Enter the code you are received");
    } else {
      const enteredCode: Number = Number(code);
      console.log(enteredCode);
      try {
        const response = await fetch("http://localhost:4000/signupConfirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, enteredCode }),
        });

        if (response.status === 409) {
          const responseData = await response.json();
          console.error(responseData.error);
          setCode("");
          setAlert(responseData.error);
        }

        if (response.ok) {
          const responseData = await response.json();
          console.log("Response OK responseData:", responseData);
          const user = responseData.user;

          dispatch({ type: "LOGIN", payload: user });
          navigate("/balance");
        } else {
          console.error("Cod confirmation failed");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
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
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Confirm</button>
      </form>
      {alert && <p className="error">{alert}</p>}
    </div>
  );
};

export default SignupConfirmPage;
