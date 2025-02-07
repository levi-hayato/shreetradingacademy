// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, GoogleAuthProvider , createUserWithEmailAndPassword  , updateProfile } from "firebase/auth";

import { getFirestore , collection, addDoc , deleteDoc , doc , getDocs , getDoc , setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgkU1ZHxgBOHeBGe8Ghn6D3ldKAGe45K4",
  authDomain: "shreetrading-78787.firebaseapp.com",
  projectId: "shreetrading-78787",
  storageBucket: "shreetrading-78787.firebasestorage.app",
  messagingSenderId: "199653026960",
  appId: "1:199653026960:web:2e869ae383272d3fe5bc15",
  measurementId: "G-Q1ZNSZFPTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider , getDoc , setDoc , updateProfile ,db , collection, addDoc, createUserWithEmailAndPassword ,deleteDoc , doc , getDocs};