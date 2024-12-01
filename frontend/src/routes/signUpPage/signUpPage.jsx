import "./signUpPage.css";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Funkcja do rejestracji w Firebase
import { auth } from "../../../firebaseConfig"; // Auth z firebaseConfig
import { useNavigate } from "react-router-dom"; // do przekierowania

const SignUpPage = () => {
  const [email, setEmail] = useState(""); // Stan dla e-maila
  const [password, setPassword] = useState(""); // Stan dla hasła
  const [confirmPassword, setConfirmPassword] = useState(""); // Stan dla potwierdzenia hasła
  const [error, setError] = useState(""); // Stan na błędy
  const navigate = useNavigate(); // do przekierowania po rejestracji

  const handleSignUp = async (e) => {
    e.preventDefault(); // Zapobieganie domyślnej akcji formularza

    if (password !== confirmPassword) {
      setError("Passwords do not match"); // Błąd, jeśli hasła się różnią
      return;
    }

    try {
      // Rejestracja użytkownika za pomocą Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Po udanej rejestracji przekierowujemy użytkownika na dashboard
      navigate("/dashboard");

      // Pobieranie tokena ID dla nowo zarejestrowanego użytkownika
      const user = userCredential.user;
      const idToken = await user.getIdToken(); // Pobieramy token

      // Wyświetlamy token w konsoli (możesz go użyć do dalszych operacji)
      console.log("User ID Token:", idToken);
    } catch (error) {
      setError(error.message); // Wyświetlanie błędu, jeśli rejestracja się nie udała
    }
  };

  return (
    <div className="signUpPage">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="inputField">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Aktualizowanie stanu dla email
            required
          />
        </div>
        <div className="inputField">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Aktualizowanie stanu dla hasła
            required
          />
        </div>
        <div className="inputField">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Aktualizowanie stanu dla potwierdzenia hasła
            required
          />
        </div>
        {error && <p className="error">{error}</p>} {/* Wyświetlanie błędów */}
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/sign-in">Sign In</a>
      </p>
    </div>
  );
};

export default SignUpPage;
