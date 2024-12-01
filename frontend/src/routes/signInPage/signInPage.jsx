import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"; // Używamy tej funkcji z Firebase
import { auth } from "../../../firebaseConfig"; // auth z firebaseConfig
import { useNavigate } from "react-router-dom"; // jeśli chcesz korzystać z react-router do nawigacji
import "./signInPage.css";

const SignInPage = () => {
  const [email, setEmail] = useState(""); // stan na e-mail
  const [password, setPassword] = useState(""); // stan na hasło
  const [error, setError] = useState(""); // stan na błędy logowania
  const navigate = useNavigate(); // do przekierowań

  const handleSignIn = async (e) => {
    e.preventDefault(); // zapobiega domyślnej akcji formularza

    try {
      // Używamy auth z firebaseConfig
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Po udanym logowaniu, przekierowujemy użytkownika na dashboard
      navigate("/dashboard");

      // Pobieranie tokena ID dla zalogowanego użytkownika
      const user = userCredential.user;
      const idToken = await user.getIdToken(); // Pobieramy token

      // Wyświetlamy token w konsoli
      console.log("User ID Token:", idToken);
    } catch (error) {
      setError(error.message); // wyświetlamy błąd w przypadku nieudanej próby logowania
    }
  };

  return (
    <div className="signInContainer">
      <div className="signInPage">
        <h2>Sign In</h2>
        <form onSubmit={handleSignIn}>
          <div className="inputField">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // aktualizujemy email
              required
            />
          </div>
          <div className="inputField">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // aktualizujemy hasło
              required
            />
          </div>
          {error && <p className="error">{error}</p>}{" "}
          {/* Wyświetlamy komunikat o błędzie */}
          <button type="submit">Sign In</button>
        </form>
        <p>
          Don't have an account? <a href="/sign-up">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
