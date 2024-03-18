import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyAbowcMzjKwydyYSfWDnxhDetiDEqYX6Lk",
  authDomain: "post-it-2b841.firebaseapp.com",
  projectId: "post-it-2b841",
  storageBucket: "post-it-2b841.appspot.com",
  messagingSenderId: "113155618847",
  appId: "1:113155618847:web:c025880d6d2d68e999fd2a"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)