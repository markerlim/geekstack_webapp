
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth"
import { getFirestore} from "firebase/firestore"
import {getStorage} from"firebase/storage"

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
export const app = initializeApp(firebaseConfig);
// Initialize Database
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
