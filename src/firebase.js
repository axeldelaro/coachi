import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLlQtXyuheI_jM2FNcvi6U_8pUpoMqBeY",
  authDomain: "protocole-coach.firebaseapp.com",
  projectId: "protocole-coach",
  storageBucket: "protocole-coach.firebasestorage.app",
  messagingSenderId: "671804357066",
  appId: "1:671804357066:web:4215dfd839ac4fa8807733",
  measurementId: "G-03ZWJZ3XWM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
