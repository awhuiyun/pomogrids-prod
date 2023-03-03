// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWjthAsjtPgwEzWwKK5h7bFELcEy0p8oE",
  authDomain: "pomogrids.firebaseapp.com",
  projectId: "pomogrids",
  storageBucket: "pomogrids.appspot.com",
  messagingSenderId: "1067831512785",
  appId: "1:1067831512785:web:01b03c9ca40566748c7ff0",
  measurementId: "G-R4Y6TXG833",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
