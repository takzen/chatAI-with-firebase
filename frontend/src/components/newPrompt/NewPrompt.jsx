import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth"; // Importujemy getAuth z Firebase

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState(""); // Przechowuje pytanie użytkownika
  const [answer, setAnswer] = useState(""); // Przechowuje odpowiedź na pytanie
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  // Inicjalizacja czatu - upewniamy się, że historia zawiera początkową wiadomość
  const chat = model.startChat({
    history:
      data?.history?.length > 0
        ? data.history.map(({ role, parts }) => ({
            role,
            parts: [{ text: parts[0].text }],
          }))
        : [{ role: "user", parts: [{ text: "Hi! How can I help?" }] }], // Domyślny komunikat "user"
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const user = getAuth().currentUser; // Pobieramy bieżącego użytkownika z Firebase

      if (!user) {
        throw new Error("User not authenticated"); // Jeśli użytkownik nie jest zalogowany, rzucamy błąd
      }

      const token = await user.getIdToken(); // Pobieramy token ID użytkownika

      // Wykonujemy zapytanie PUT z tokenem w nagłówku
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,
        {
          method: "PUT",
          credentials: "include", // Zostawiamy credentials, jeśli API ich potrzebuje
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Dodajemy token do nagłówka
          },
          body: JSON.stringify({
            question: question.length ? question : undefined,
            answer,
            img: img.dbData?.filePath || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update chat"); // Jeśli odpowiedź nie jest OK, rzucamy błąd
      }

      return response.json(); // Zwracamy dane w formacie JSON
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      mutation.mutate(); // Wywołanie mutacji do zaktualizowania czatu
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false); // Dodanie nowego promptu
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, [data]);

  return (
    <>
      {img.isLoading && <div>Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
