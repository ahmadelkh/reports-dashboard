import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC858dZytYKxuzSaeVfDXvzRDmlXZn-HYk",
    authDomain: "reports-3f4b3.firebaseapp.com",
    projectId: "reports-3f4b3",
    storageBucket: "reports-3f4b3.firebasestorage.app",
    messagingSenderId: "201745902600",
    appId: "1:201745902600:web:fc1390f621bc26a18b35bd",
    measurementId: "G-5LK9S77331"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
