// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcnnIYDR8JFTAqUhDl4YbaeMrrQss0m8Y",
  authDomain: "immo-saadaoui.firebaseapp.com",
  projectId: "immo-saadaoui",
  storageBucket: "immo-saadaoui.appspot.com",
  messagingSenderId: "1021732847309",
  appId: "1:1021732847309:web:0ed9eb4346e74bbd28f384"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()
