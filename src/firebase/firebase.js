// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { 
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgkU1ZHxgBOHeBGe8Ghn6D3ldKAGe45K4",
  authDomain: "shreetrading-78787.firebaseapp.com",
  projectId: "shreetrading-78787",
  storageBucket: "shreetrading-78787.appspot.com",
  messagingSenderId: "199653026960",
  appId: "1:199653026960:web:2e869ae383272d3fe5bc15",
  measurementId: "G-Q1ZNSZFPTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export the services you want to use in your app
export {
  auth,
  googleProvider,
  db,
  createUserWithEmailAndPassword,
  updateProfile,
  // Firestore functions
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc
};

const firebaseServices = {
  auth,
  db,
  googleProvider
};

export default firebaseServices;