// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoLbzCMkfVx3ZVK-oAEyiPPM8LZFdJiSM",
  authDomain: "legaldoco.firebaseapp.com",
  projectId: "legaldoco",
  storageBucket: "legaldoco.appspot.com",
  messagingSenderId: "872048860776",
  appId: "1:872048860776:web:8651efc9af3faf55bce5dd",
  measurementId: "G-9P98NSNEE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage();
const storageRef = ref(storage);


export default app;