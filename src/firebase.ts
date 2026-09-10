import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABjMxGFzUBX2POMPs0U0ekMP9rztLpvwI",
  authDomain: "cc-eshop-final.firebaseapp.com",
  projectId: "cc-eshop-final",
  storageBucket: "cc-eshop-final.firebasestorage.app",
  messagingSenderId: "582076644736",
  appId: "1:582076644736:web:ac19e2d2e75b6915fdd565"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
