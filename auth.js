// auth.js

// Load Firebase SDKs from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔐 Your actual Firebase config (copied from Project settings → Web app → Config)
const firebaseConfig = {
  apiKey: "AIzaSyBf1gWjshjHcnZRMVoZDlWRTDG_74-V5vM",
  authDomain: "dogs-api-slideshow-auth.firebaseapp.com",
  projectId: "dogs-api-slideshow-auth",
  storageBucket: "dogs-api-slideshow-auth.firebasestorage.app",
  messagingSenderId: "439273084892",
  appId: "1:439273084892:web:c36882f1736752f48eec39",
};

// Initialize Firebase + Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM elements
const signInBtn = document.getElementById("sign-in-btn");
const signOutBtn = document.getElementById("sign-out-btn");
const userInfo = document.getElementById("user-info");
const appWrapper = document.getElementById("app-wrapper");

// Google sign-in
signInBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Sign-in error:", err);
    alert("Google sign-in failed. Check console for details.");
  }
});

// Sign-out
signOutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Sign-out error:", err);
    alert("Sign-out failed. Check console for details.");
  }
});

// Watch auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Logged in
    appWrapper.style.display = "block";
    signInBtn.style.display = "inline-block";   // you can hide it if you want
    signInBtn.disabled = true;                  // or disable while logged in
    signOutBtn.style.display = "inline-block";

    const name = user.displayName || user.email || "User";
    userInfo.textContent = `Logged in as ${name}`;
  } else {
    // Logged out
    appWrapper.style.display = "none";
    signInBtn.style.display = "inline-block";
    signInBtn.disabled = false;
    signOutBtn.style.display = "none";
    userInfo.textContent = "";
  }
});
