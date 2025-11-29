// auth.js

// Load Firebase (v10 modular SDK) from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔐 Your Firebase project config (from Project Settings → Web app)
const firebaseConfig = {
  apiKey: "AIzaSyBf1gWghsjHcnZRMVoZDlRwRTDG_74-V5vM",
  authDomain: "dogs-api-slideshow-auth.firebaseapp.com",
  projectId: "dogs-api-slideshow-auth",
  storageBucket: "dogs-api-slideshow-auth.firebasestorage.app",
  messagingSenderId: "439273048892",
  appId: "1:439273048892:web:c36882f173675f248eec39",
};

// Initialize Firebase + Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Grab DOM nodes
const signInBtn = document.getElementById("sign-in-btn");
const signOutBtn = document.getElementById("sign-out-btn");
const userInfo = document.getElementById("user-info");
const appWrapper = document.getElementById("app-wrapper");

// Sign in with Google
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

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Logged in
    appWrapper.style.display = "block";
    signInBtn.style.display = "inline-block";
    signInBtn.textContent = "Signed in ✅"; // optional, or hide if you want
    signInBtn.disabled = true;

    signOutBtn.style.display = "inline-block";

    const name = user.displayName || user.email || "User";
    userInfo.textContent = `Logged in as ${name}`;
  } else {
    // Logged out
    appWrapper.style.display = "none";
    signInBtn.style.display = "inline-block";
    signInBtn.textContent = "Sign in with Google";
    signInBtn.disabled = false;

    signOutBtn.style.display = "none";
    userInfo.textContent = "";
  }
});
