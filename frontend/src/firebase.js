import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLz1nimgfq4sd0EuKk2wdkLcjHrBmfpjQ",
  authDomain: "notes-a46b6.firebaseapp.com",
  projectId: "notes-a46b6",
  storageBucket: "notes-a46b6.appspot.com",
  messagingSenderId: "545140164052",
  appId: "1:545140164052:web:2a65a636a56170d34b8241"
  };

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
