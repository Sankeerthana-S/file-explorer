// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.DEV ? import.meta.env.VITE_API_KEY : "",
  authDomain: import.meta.env.DEV ? import.meta.env.VITE_AUTH_DOMAIN : "",
  projectId: import.meta.env.DEV ? import.meta.env.VITE_PROJECT_ID : "",
  storageBucket: import.meta.env.DEV ? import.meta.env.VITE_STORAGE_BUCKET : "",
  messagingSenderId: import.meta.env.DEV
    ? import.meta.env.VITE_MESSAGING_SENDER_ID
    : "",
  appId: import.meta.env.DEV ? import.meta.env.VITE_APP_ID : "",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;
