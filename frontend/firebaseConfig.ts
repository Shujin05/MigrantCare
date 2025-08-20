// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJGTetBa_iOePSeammd_Nvm3YRkkPKr2A",
  authDomain: "migrant-care-agentic.firebaseapp.com",
  projectId: "migrant-care-agentic",
  storageBucket: "migrant-care-agentic.firebasestorage.app",
  messagingSenderId: "680834327566",
  appId: "1:680834327566:web:279207c01a4deab96c085f",
  measurementId: "G-CP831FNVWW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app); 
