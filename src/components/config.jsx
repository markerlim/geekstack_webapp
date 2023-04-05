// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC06e8Vv1fyzBpoDCOnXocWwKUJtJZwW7M",
  authDomain: "geek-stack.firebaseapp.com",
  projectId: "geek-stack",
  storageBucket: "geek-stack.appspot.com",
  messagingSenderId: "380411056228",
  appId: "1:380411056228:web:48cfe95eb39a006c724f71",
  measurementId: "G-E2GKNFJDK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Database
export const db = getDatabase(app);