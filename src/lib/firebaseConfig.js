// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUcMEtnQqk9eM-H9FGRd9HqFh8Dq7jANA",
  authDomain: "babyshark-f0948.firebaseapp.com",
  projectId: "babyshark-f0948",
  storageBucket: "babyshark-f0948.appspot.com",
  messagingSenderId: "1031864862467",
  appId: "1:1031864862467:web:882d56eaa4f89da9e1cb36"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export {
  addDoc,
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  deleteDoc,
};
