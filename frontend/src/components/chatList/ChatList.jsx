import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { auth } from "../../../firebaseConfig"; // Upewnij się, że auth jest importowane

const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const user = getAuth().currentUser;

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Pobranie tokena
      const token = await user.getIdToken();

      // Wykonanie zapytania z tokenem
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/userchats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token do nagłówka
          },
          credentials: "include", // Wysyła ciasteczka
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user chats");
      }

      return response.json();
    },
  });

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore Chat</Link>
      <Link to="/">Go to Home</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending
          ? "Loading..."
          : error
          ? "Something went wrong!"
          : data?.map((chat) => (
              <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                {chat.title}
              </Link>
            ))}
      </div>
      <hr />
      <div className="upgrade">
        {/* <img src="/logo.png" alt="" /> */}
        <div className="texts">
          <span>Upgrade to Premium</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
