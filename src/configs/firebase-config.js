import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyqN-kRq7KmU-UnUWjjLaiPRnLFDQRtC0",
  authDomain: "chat-app-5b7ff.firebaseapp.com",
  projectId: "chat-app-5b7ff",
  storageBucket: "chat-app-5b7ff.appspot.com",
  messagingSenderId: "644785795220",
  appId: "1:644785795220:web:6f791b887120f3446dc481"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);