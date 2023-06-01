//Version 9
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth } from "firebase/auth";
import "firebase/functions";
import { getFunctions, httpsCallable } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjFhkrBByOUliqcUpgn-PBXapZQRh-c8w",
  authDomain: "solutionsapp-55198.firebaseapp.com",
  projectId: "solutionsapp-55198",
  storageBucket: "solutionsapp-55198.appspot.com",
  messagingSenderId: "140130769187",
  appId: "1:140130769187:web:f783852af17de817df1496",
  measurementId: "G-LGD6TEG41Y",
};

// const functions = require('firebase/functions');

// Initialize Firebase client-side app
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
// const db = require(getFirestore(app))
const db = getFirestore(app);
const sendNotification = httpsCallable("sendNotification");
// console.log(db)
// console.log(functions)

export { db, auth, app, sendNotification };
