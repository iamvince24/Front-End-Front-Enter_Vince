import { firebaseConfig } from "./firebaseConfig.js";
import { setRedirectLink } from "./utils.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";

// Add Firebase products that you want to use
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const registerWithEmailAndPassword = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    // const user = res.user;
    const urlId = res.user.email.split("@")[0];
    // console.log(urlId);
    window.location.href = setRedirectLink("profile", urlId);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (auth, email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    // const user = res.user;
    const urlId = res.user.email.split("@")[0];
    // console.log(urlId);
    window.location.href = setRedirectLink("profile", urlId);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    // const user = res.user;
    const urlId = res.user.email.split("@")[0];
    // console.log(urlId);
    window.location.href = setRedirectLink("profile", urlId);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
  window.location.href = setRedirectLink("index", null);
};

export {
  auth,
  registerWithEmailAndPassword,
  logInWithEmailAndPassword,
  signInWithGoogle,
  logout,
};
