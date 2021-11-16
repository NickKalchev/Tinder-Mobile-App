import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCPoC_OIzzNWCDTugThGGiF-HM5N1Ht4nY",
  authDomain: "tinder-mobile.firebaseapp.com",
  projectId: "tinder-mobile",
  storageBucket: "tinder-mobile.appspot.com",
  messagingSenderId: "398862951178",
  appId: "1:398862951178:web:b0fd1add68227ac1df10f3",
  measurementId: "G-W1VE1Q49RL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };