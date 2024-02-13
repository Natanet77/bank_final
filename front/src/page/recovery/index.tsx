import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { BackButton } from "../../component/back-button";

const RecoveryPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [isEmailValid, setEmailIsValid] = useState(true);
  // const navigate = useNavigate();
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newEmail: string = e.target.value;
    setEmail(newEmail);
    // setEmailIsValid(validateEmail(newEmail));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("email:", email);
    if (!email) {
      setError("Please, enter your email");
    } else {
      // setEmailIsValid(validateEmail(email));
      if (isEmailValid) {
        console.log("email is valid");
        try {
          const response = await fetch("http://localhost:4000/recovery", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          if (response.status === 409) {
            const responseData = await response.json();
            console.error(responseData.error);

            setError(responseData.error);
          }

          if (response.ok) {
            const responseData = await response.json(); // Parse the JSON response
            console.log("Response OK responseData:", responseData);

            navigate(`/recovery-confirm?email=${email}`);
          } else {
            console.error("Recovery failed");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch("/recovery", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email }),
  //     });
  //     const data = await response.json();
  //     if (data.success) {
  //       navigate("/recovery-confirm");
  //     } else {
  //       throw new Error(data.message);
  //     }
  //   } catch (error) {
  //     console.error("Помилка при підтвердженні реєстрації:", error); // Логування помилки
  //   }
  // };

  return (
    <div className="recovery-container">
      <form onSubmit={handleSubmit}>
        <BackButton />
        <div className="recovery-title">
          <h1>Recover password</h1>
          <p>Choose a recovery method</p>
        </div>
        <label htmlFor="email">Email</label>
        <input
          className="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <button type="submit">Send code</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
export default RecoveryPage;
