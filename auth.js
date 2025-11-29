// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔐 paste the config from your Firebase web app here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "dogs-api-slideshow-auth.firebaseapp.com",
  projectId: "dogs-api-slideshow-auth",
  storageBucket: "dogs-api-slideshow-auth.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:YYYYYYYYYYYY",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Grab DOM nodes
const signInBtn = document.getElementById("sign-in-btn");
const signOutBtn = document.getElementById("sign-out-btn");
const userInfo = document.getElementById("user-info");
const appWrapper = document.getElementById("app-wrapper");

// Sign in
signInBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Sign-in error:", err);
    alert("Google sign-in failed. Check console for details.");
  }
});

// Sign out
signOutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Sign-out error:", err);
    alert("Sign-out failed. Check console for details.");
  }
});

// React to auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // logged in
    appWrapper.style.display = "block";
    signInBtn.style.display = "none";
    signOutBtn.style.display = "inline-block";

    const name = user.displayName || user.email || "User";
    userInfo.textContent = `Logged in as ${name}`;
  } else {
    // logged out
    appWrapper.style.display = "none";
    signInBtn.style.display = "inline-block";
    signOutBtn.style.display = "none";
    userInfo.textContent = "";
  }
});
