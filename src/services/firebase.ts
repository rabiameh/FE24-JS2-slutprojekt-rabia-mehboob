import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGyPMK43Q_mieAk6kD5Moi2wNria8Pp_I",
  authDomain: "scrumboard-f15e7.firebaseapp.com",
  databaseURL: "https://scrumboard-f15e7-default-rtdb.firebaseio.com",
  projectId: "scrumboard-f15e7",
  storageBucket: "scrumboard-f15e7.firebasestorage.app",
  messagingSenderId: "207920494600",
  appId: "1:207920494600:web:0c6a9f5a683128000cb9bd",
  measurementId: "G-W3VKKPNWQS",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
