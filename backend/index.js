import express from "express";
import cors from "cors";
// import path from "path";
// import url, { fileURLToPath } from "url";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js"; // Schemat do czatów
import UserChats from "./models/userChats.js"; // Schemat do czatów użytkowników
import firebaseAdmin from "firebase-admin";
import dotenv from "dotenv";

// Wczytanie zmiennych środowiskowych
dotenv.config();

// Zmieniamy import z JSON na 'require' z 'createRequire'
import { createRequire } from "module"; // Importujemy funkcję createRequire z modułu 'module'
const require = createRequire(import.meta.url); // Tworzymy `require` dla modułów ESM
const serviceAccount = require("./service_account.json"); // Używamy require do załadowania pliku JSON

// Inicjalizacja Firebase Admin z pliku JSON
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const port = process.env.PORT || 3000;
const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// Połączenie z MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

// Konfiguracja ImageKit (jeśli jest używane do uploadu obrazów)
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// Middleware do weryfikacji tokenu Firebase
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).send("Unauthorized");
  }

  try {
    // Weryfikacja tokenu Firebase
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Zapisanie danych użytkownika w req.user
    next(); // Kontynuowanie procesu do endpointu
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

app.post("/api/chats", verifyToken, async (req, res) => {
  const userId = req.user.uid; // Uwierzytelnienie Firebase
  const { text } = req.body;

  try {
    // Tworzenie nowego czatu
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // Sprawdzenie, czy istnieje wpis w UserChats
    const userChats = await UserChats.find({ userId: userId });

    if (!userChats.length) {
      // Jeśli użytkownik nie istnieje, utwórz nowy dokument UserChats
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // Jeśli istnieje, zaktualizuj listę czatów
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }

    res.status(201).send(savedChat._id); // Zwracamy ID nowego czatu
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
});

// Endpoint do pobierania listy czatów użytkownika
app.get("/api/userchats", verifyToken, async (req, res) => {
  const userId = req.user.uid; // Używamy UID użytkownika z Firebase

  try {
    const userChats = await UserChats.find({ userId });
    res.status(200).send(userChats[0]?.chats || []);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching userchats!");
  }
});

// Endpoint do pobierania konkretnego czatu
app.get("/api/chats/:id", verifyToken, async (req, res) => {
  const userId = req.user.uid; // Używamy UID użytkownika z Firebase
  const { id } = req.params;

  // Sprawdzamy, czy chatId jest poprawnym ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid chatId format");
  }

  try {
    const chat = await Chat.findOne({ _id: id, userId });
    if (!chat) {
      return res.status(404).send("Chat not found!");
    }
    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
});

// Endpoint do aktualizacji czatu
app.put("/api/chats/:id", verifyToken, async (req, res) => {
  const userId = req.user.uid; // Używamy UID użytkownika z Firebase
  const { id } = req.params;
  const { question, answer, img } = req.body;

  // Sprawdzamy, czy chatId jest poprawnym ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid chatId format");
  }

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
});

// Obsługa błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

// PRODUCTION
// app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });

// Uruchomienie serwera
app.listen(port, () => {
  connect();
  console.log("Server running on port " + port);
});
