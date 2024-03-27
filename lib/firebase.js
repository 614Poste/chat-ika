// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAcW4h2Ipg9pVNKC-yd8HdhEy64FcUFPdI",
    authDomain: "ikachat-91807.firebaseapp.com",
    projectId: "ikachat-91807",
    storageBucket: "ikachat-91807.appspot.com",
    messagingSenderId: "973295536435",
    appId: "1:973295536435:web:953893f43203aeb8745646"
   
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth };