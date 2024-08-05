// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCx4Pl3ERGGTgI_NpE68sN-YhPJwsCNNRE",
  authDomain: "inventory-tracker-deb75.firebaseapp.com",
  projectId: "inventory-tracker-deb75",
  storageBucket: "inventory-tracker-deb75.appspot.com",
  messagingSenderId: "473605777822",
  appId: "1:473605777822:web:2349633e8a59e7a3e14e8f",
  measurementId: "G-X0SXTCJKMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}