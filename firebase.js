// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  get,
  update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔑 PUT YOUR CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyAgIn5xsORMZnEVKnLS5gdZYbQdoNdmchQ",
  authDomain: "mochi-cb8b3.firebaseapp.com",
  projectId: "mochi-cb8b3",
  storageBucket: "mochi-cb8b3.firebasestorage.app",
  messagingSenderId: "861032755247",
  appId: "1:861032755247:web:74d105074c1a1f995a16da",
  measurementId: "G-YPTR5FVMV5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, push, onValue, get, update };