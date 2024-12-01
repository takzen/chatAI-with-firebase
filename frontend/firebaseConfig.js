// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9ZQnZ5PuIDnIXVy_SR4_PfVTBN0lCmGE",
  authDomain: "chatai-421aa.firebaseapp.com",
  projectId: "chatai-421aa",
  storageBucket: "chatai-421aa.firebasestorage.app",
  messagingSenderId: "188990728128",
  appId: "1:188990728128:web:7962fa493f19f291264a25",
  measurementId: "G-939E7PDZ8Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

const auth = getAuth(app);

export { auth, firestore }; // Eksportuj auth i firestore
export default { app, firestore }; // Eksportuj także aplikację, jeśli tego potrzebujesz
