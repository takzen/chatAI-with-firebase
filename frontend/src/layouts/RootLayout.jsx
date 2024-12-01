import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom"; // Link do nawigacji oraz Outlet na dynamiczne renderowanie komponentów
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import React Query
import { auth } from "../../firebaseConfig"; // auth z firebaseConfig
import { signOut } from "firebase/auth"; // Importujemy funkcję signOut z Firebase
import styled from "styled-components";

const RootStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  margin: 0 auto;
  box-sizing: border-box;
  height: 100vh; /* Wysokość pełnego ekranu */
  width: 100%;
  max-width: 1920px;
  justify-content: center;
  overflow-y: auto;
  background: linear-gradient(to top, #2a3c2f, #3d4c45, #1f352e);
`;

const HeaderStyled = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const MainStyled = styled.main`
  flex: 1; /* Flexbox umożliwia dostosowanie się do zawartości */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
`;

const LogoStyled = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  gap: 8px;
`;

const LogoImg = styled.img`
  width: 150px;
  height: 32px;
`;

const UserStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;

  button {
    padding: 10px;
    background-color: #b3df72;
    color: black;
    font-weight: 500;
    width: 120px;
    border-radius: 5px;
    font-size: 14px;

    &:hover {
      background-color: #93b65f;
    }
  }
`;

// Tworzymy instancję QueryClient
const queryClient = new QueryClient();

const RootLayout = () => {
  const [user, setUser] = useState(null); // Stan do przechowywania danych użytkownika

  // Funkcja do obsługi wylogowania
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Wylogowujemy użytkownika z Firebase
      setUser(null); // Usuwamy dane użytkownika po wylogowaniu
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  };

  // Sprawdzamy, czy użytkownik jest zalogowany, gdy komponent się ładuje
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Ustawiamy dane użytkownika, gdy jest zalogowany
      } else {
        setUser(null); // Usuwamy dane użytkownika, gdy nie jest zalogowany
      }
    });

    // Czyszczenie subskrypcji
    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RootStyled>
        <HeaderStyled>
          <Link to="/">
            <LogoStyled>
              <LogoImg src="/logo.png" alt="logo yogaherbs" />
              <span>CHAT</span>
            </LogoStyled>
          </Link>

          {/* Jeśli użytkownik jest zalogowany, wyświetlamy jego e-mail i przycisk wylogowania */}
          {user ? (
            <UserStyled>
              <p>{user.email}</p> {/* Wyświetlanie e-mail użytkownika */}
              <button onClick={handleSignOut}>Sign Out</button>{" "}
              {/* Przycisk do wylogowania */}
            </UserStyled>
          ) : (
            <UserStyled>
              <Link to="/sign-in">Sign In</Link>{" "}
              {/* Link do logowania, jeśli użytkownik nie jest zalogowany */}
            </UserStyled>
          )}
        </HeaderStyled>

        <MainStyled>
          <Outlet />{" "}
          {/* Tu będą renderowane inne komponenty zależnie od trasy */}
        </MainStyled>
      </RootStyled>
    </QueryClientProvider>
  );
};

export default RootLayout;
