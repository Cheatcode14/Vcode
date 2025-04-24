import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAd0yxPkMVoerKq6pPZvXyTbOEaMILss4A",
    authDomain: "vcode-3b099.firebaseapp.com",
    projectId: "vcode-3b099",
    storageBucket: "vcode-3b099.appspot.com",
    messagingSenderId: "230736955287",
    appId: "1:230736955287:web:926fc8df65c6386eb326d2",
    measurementId: "G-NMDL4TH3T3",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();

export { auth, db };
