// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhdN3kJ0XXm4jK-NIwIECsJrOf2UppTo0",
  authDomain: "file-explorer-25e8b.firebaseapp.com",
  projectId: "file-explorer-25e8b",
  storageBucket: "file-explorer-25e8b.appspot.com",
  messagingSenderId: "619508694057",
  appId: "1:619508694057:web:62d476834dbeeca7f33038",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;
