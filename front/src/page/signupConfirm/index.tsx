import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../container/AuthContext";
import "./index.css";
import { BackButton } from "../../component/back-button";

const SignupConfirmPage = () => {
  // const [code, setCode] = useState("");
  // const [error, setError] = useState("");
  // const { state,dispatch } = useAuth();
  // const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // useEffect(() => {
  //   const fetchConfirmationCode = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:4000/signupConfirm
  //         )`,
  //         {
  //           method: "GET",
  //           headers: { "Content-Type": "application/json" },
  //         }
  //       );
  //       const data = await response.json();
  //       console.log("Відповідь на отримання коду підтвердження:", data); // Логування отриманої відповіді
  //       if (response.ok) {
  //         alert(`Your confirmation code: ${data.confirmationCode}`);
  //         setCode(data.confirmationCode);
  //       } else {
  //         setError(data.message || "Failed to fetch confirmation code.");
  //       }
  //     } catch (err) {
  //       console.error("Помилка при отриманні коду підтвердження:", err); // Логування помилки
  //       setError("An error occurred while fetching the confirmation code.");
  //     }
  //   };
  //   if (email) {
  //     fetchConfirmationCode();
  //   }
  // }, [email]);
  // const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch("http://localhost:4000/signupConfirm", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email: email, confirmationCode: code }),
  //     });
  //     const data = await response.json();
  //     console.log("Відповідь на підтвердження реєстрації:", data); // Логування отриманої відповіді
  //     if (data.success) {
  //       login(data.token, data.user);
  //       navigate("/balance");
  //     } else {
  //       setError(data.message);
  //     }
  //   } catch (err) {
  //     console.error("An error occurred:", err); // Логування помилки
  //     // setError("An error occurred. Please try again.");
  //   }
  // };

  const [code, setCode] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const { state, dispatch } = useAuth();
  //const { state, dispatch } = useContext(AuthContext);

  //const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //const newCode: number = parseInt((e.target as HTMLInputElement).value, 10);
    const newCode = (e.target as HTMLInputElement).value;
    setCode(newCode);
    //const code: Number = code;
    //const code = (e.target as HTMLInputElement).value;
    //const code = e.target.value;
    const email = state.email;
    console.log("code: ", code, "email:", email);

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
          // 'Invalid code'
          const responseData = await response.json();
          console.error(responseData.error);
          setCode("");
          setAlert(responseData.error);
        }

        if (response.ok) {
          // Code confirmed
          const responseData = await response.json(); // Parse the JSON response
          console.log("Response OK responseData:", responseData);
          const user = responseData.user;

          // Dispatch the "LOGIN" action to update the state
          dispatch({ type: "LOGIN", payload: user });
          navigate("/balance");
        } else {
          // Handle registration errors
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
