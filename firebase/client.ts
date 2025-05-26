// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // FIXED: Use client SDK

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPWOfvDsljv1axKWoEe3M63sj70YMFjec",
  authDomain: "shidohansei.firebaseapp.com",
  projectId: "shidohansei",
  storageBucket: "shidohansei.appspot.com", // FIXED: Corrected storage bucket URL
  messagingSenderId: "476186894718",
  appId: "1:476186894718:web:007201bf48bd9f13afd32f",
  measurementId: "G-HEW1G2SQ5S"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp(); // FIXED: Added parentheses

export const auth = getAuth(app);
export const db = getFirestore(app);