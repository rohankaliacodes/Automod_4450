import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzjpGJ7e7yp88vDNZqIfhWyM6nsGRN2WY",
  authDomain: "capstone-901ca.firebaseapp.com",
  projectId: "capstone-901ca",
  storageBucket: "capstone-901ca.firebasestorage.app",
  messagingSenderId: "733373415576",
  appId: "1:733373415576:web:ad9b49d3d14445d6df50ed",
  measurementId: "G-BG8F03KV5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);