import firebaseConfig from "./config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


export { GoogleAuthProvider, signInWithPopup }; 
