// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDOx7qn2HmaNXA9o_a22iPbqeWYNQfBO0",
  authDomain: "ndutecsaytit.firebaseapp.com",
  projectId: "ndutecsaytit",
  storageBucket: "ndutecsaytit.appspot.com",
  messagingSenderId: "896565783537",
  appId: "1:896565783537:web:469c053ca8de1d2a023250"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
