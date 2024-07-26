// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-iqIcI0bTFsfaLn52golftCitd8obcDc",
  authDomain: "fir-test-5f805.firebaseapp.com",
  databaseURL: "https://fir-test-5f805-default-rtdb.firebaseio.com",
  projectId: "fir-test-5f805",
  storageBucket: "fir-test-5f805.appspot.com",
  messagingSenderId: "273997121044",
  appId: "1:273997121044:web:478f4af3191cfd6791c901",
  measurementId: "G-ER296ZXRRT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
