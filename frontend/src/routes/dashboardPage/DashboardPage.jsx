import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Importowanie Firebase Auth

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (text) => {
      const user = getAuth().currentUser; // Pobieramy użytkownika z Firebase

      if (!user) {
        throw new Error("User not authenticated"); // Jeśli użytkownik nie jest zalogowany
      }

      const token = await user.getIdToken(); // Pobieramy token

      // Wykonanie zapytania do API z nagłówkiem autoryzacyjnym
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Dodanie tokenu do nagłówka
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create new chat");
      }

      return response.json();
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text); // Wywołanie mutacji
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          {/* <img src="/logo.png" alt="" /> */}
          <h1>CHAT AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/image1.png" alt="" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image2.png" alt="" />
            <span>Analyze Images</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
