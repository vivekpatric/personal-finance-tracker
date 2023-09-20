// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore , doc , setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKrwpkMWGlETy-qkLKJEKW5vgeqxP2reY",
  authDomain: "financely-9c512.firebaseapp.com",
  projectId: "financely-9c512",
  storageBucket: "financely-9c512.appspot.com",
  messagingSenderId: "1034368596688",
  appId: "1:1034368596688:web:b456177eed8f54ab6b3cd5",
  measurementId: "G-D7H7J1VLMH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db= getFirestore(app);
const auth =getAuth(app);
const provider =new GoogleAuthProvider();
export { db, auth , provider ,doc, setDoc };
