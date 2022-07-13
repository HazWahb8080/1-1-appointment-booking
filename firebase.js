import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCC0AwD0S7xODOjcQYugQBBBzsC4QAqjZs",
  authDomain: "booking-7a1ea.firebaseapp.com",
  projectId: "booking-7a1ea",
  storageBucket: "booking-7a1ea.appspot.com",
  messagingSenderId: "782298897401",
  appId: "1:782298897401:web:ba2f98935296229c9cfb28",
  databaseURL: "",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
