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
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

const registerWithEmailAndPassword = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    window.localStorage.setItem("UID", uid);
    // adding default data
    await writeUserData(uid, "請輸入姓名", "請輸入號碼", res.user.email);
    const urlId = res.user.email.split("@")[0];
    window.location.href = setRedirectLink("profile", urlId);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (auth, email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    window.localStorage.setItem("UID", uid);
    await readUserData(uid);

    const urlId = res.user.email.split("@")[0];
    window.location.href = setRedirectLink("profile", urlId);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    const uid = res.user.uid;
    window.localStorage.setItem("UID", uid);

    await readUserData(uid);
    const urlId = res.user.email.split("@")[0];
    window.location.href = setRedirectLink("profile", urlId);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (auth, email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
  window.location.href = setRedirectLink("index", null);
};

const writeUserData = async (userId, name, phone, email) => {
  const db = getDatabase();
  await set(ref(db, "users/" + userId), {
    username: name,
    phone: phone,
    email: email,
  });
};

const readUserData = async (userId) => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `users/${userId}`));
  return [snapshot.val().username, snapshot.val().email, snapshot.val().phone];
  //   if (snapshot.exists()) {
  //     console.log(snapshot.val());
  //   } else {
  //     console.log("No data available");
  //   }
};

export {
  auth,
  registerWithEmailAndPassword,
  logInWithEmailAndPassword,
  signInWithGoogle,
  logout,
  database,
  writeUserData,
  readUserData,
  sendPasswordReset,
};
