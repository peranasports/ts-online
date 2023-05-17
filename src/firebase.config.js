import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAeRKiRrnBfSpWM-XTFG8743zTkF136CUg",
  authDomain: "ts-online-aa52d.firebaseapp.com",
  projectId: "ts-online-aa52d",
  storageBucket: "ts-online-aa52d.appspot.com",
  messagingSenderId: "1031710993950",
  appId: "1:1031710993950:web:c5bd8423e945128378880f",
  measurementId: "G-W8G48XX6WY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore()