import { firebaseConfig } from "./firebaseConfig.js";
import { setRedirectLink } from "./utils.js";
import { alertMessage } from "./common.js";

// import { emailjs } from "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";

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

const articleCollectInit = {
  "-LNiP-cd31m_XrDZJxdl": { isStarred: false },
  "-LNyOk-FQnejK4pZYqAi": { isStarred: false },
  "-LNyPzKvn1h2QX_CDwET": { isStarred: false },
  "-LNySD7c2UOilxjkW14U": { isStarred: false },
  "-LNyUA-GLYQyCACdkDjg": { isStarred: false },
  "-LNyYDaCeasm6O-nP8FE": { isStarred: false },
  "-LNy_jj1Fj-HF0XbbRtb": { isStarred: false },
  "-LO17F-h-LN77A7uHJcV": { isStarred: false },
  "-LOvaej1H569KD4eXNZG": { isStarred: false },
};

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
    await writeUserData(
      uid,
      "請輸入姓名",
      "請輸入號碼",
      res.user.email,
      articleCollectInit
    );
    window.localStorage.setItem(
      "articleCollect",
      JSON.stringify(articleCollectInit)
    );
    const urlId = res.user.email.split("@")[0];
    window.location.href = setRedirectLink("profile", urlId, "id");
  } catch (err) {
    if (email === "" || password === "") {
      alertMessage("Error!", "請填寫信箱或密碼");
    } else {
      alertMessage(err.code, "");
    }
  }
};

const logInWithEmailAndPassword = async (auth, email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    window.localStorage.setItem("UID", uid);
    const [, , , article] = await readUserData(uid);
    window.localStorage.setItem("articleCollect", JSON.stringify(article));
    const urlId = res.user.email.split("@")[0];
    window.location.href = setRedirectLink("profile", urlId, "id");
  } catch (err) {
    if (email === "" || password === "") {
      alertMessage("Error!", "請填寫信箱或密碼");
    } else {
      alertMessage(err.code, "");
    }
  }
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    const uid = res.user.uid;
    window.localStorage.setItem("UID", uid);

    await writeUserData(
      uid,
      "請輸入姓名",
      "請輸入號碼",
      res.user.email,
      articleCollectInit
    );

    const [, , , article] = await readUserData(uid);
    window.localStorage.setItem("articleCollect", JSON.stringify(article));

    const urlId = res.user.email.split("@")[0];
    window.location.href = setRedirectLink("profile", urlId, "id");
  } catch (err) {
    if (email === "" || password === "") {
      alertMessage("Error!", "請填寫信箱或密碼");
    } else {
      alertMessage(err.code, "");
    }
  }
};

const sendPasswordReset = async (auth, email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    if (email === "") {
      alertMessage(err.code, "請填寫信箱");
    } else {
      alertMessage(err.code, err.message);
    }
  }
};

const logout = () => {
  signOut(auth);
  window.location.href = setRedirectLink("index", null, null);
};

const writeUserData = async (
  userId,
  name,
  phone,
  email,
  article = articleCollectInit
) => {
  const db = getDatabase();

  if (!article) {
    await set(ref(db, "users/" + userId), {
      username: name,
      phone: phone,
      email: email,
      article: article,
    });
  } else {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${userId}`));
    const userData = snapshot.val();

    const updatedData = {
      username: name !== null ? name : userData.username,
      phone: phone !== null ? phone : userData.phone,
      email: email !== null ? email : userData.email,
      article: article !== null ? article : userData.article,
    };

    await set(ref(db, "users/" + userId), updatedData);
  }
};

const readUserData = async (userId) => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `users/${userId}`));
  return [
    snapshot.val().username,
    snapshot.val().email,
    snapshot.val().phone,
    snapshot.val().article,
  ];
};

async function fetchData() {
  const dbRef = ref(getDatabase());
  const snapshot = await get(dbRef);
  return snapshot.val();
}

async function contactMessage(value) {
  emailjs.init("Emr4nsGWX_CVxzxuB");
  const [name, email, topic, content] = value;
  const db = getDatabase();

  const sanitizedEmail = email.replace(/\./g, "_");

  var newContactRef = {
    name: name,
    email: email,
    topic: topic,
    content: content,
  };

  await set(ref(db, "contacts/" + `${name}`), newContactRef);

  try {
    await set(ref(db, "contacts/" + sanitizedEmail), newContactRef);

    emailjs
      .send("service_f85wcm2", "template_sa2hb0q", {
        from_name: name,
        from_email: email,
        message_subject: topic,
        message_body: content,
      })
      .then(
        function (response) {
          // console.log("Email sent successfully:", response);
          alertMessage("Success!", "信件已寄出！請至信箱檢查您寄出的信件內容");
        },
        function (error) {
          // console.error("Email sending failed:", error);
          alertMessage("Error!", "郵件發送失敗！請稍後再試。");
        }
      );
  } catch (error) {
    console.error("Error setting data in Firebase:", error);
    alertMessage("Error!", "郵件發送失敗！請稍後再試。");
  }
}

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
  fetchData,
  contactMessage,
};
