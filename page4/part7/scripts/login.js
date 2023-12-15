import { stopPropagationHandler } from "./utils.js";
import {
  auth,
  registerWithEmailAndPassword,
  logInWithEmailAndPassword,
  signInWithGoogle,
  sendPasswordReset,
} from "./firebase.js";

// check login or not
const urlSearchParams = new URLSearchParams(window.location.search);
const userId = urlSearchParams.get("id");

if (userId) {
  // Member page
  const memberHome = document.querySelector("#member-home");
  const memberArticle = document.querySelector("#member-article");
  const memberSkilltree = document.querySelector("#member-skilltree");
  const loginBtn = document.querySelector("#login-btn");
  const memberBtn = document.querySelector("#member-btn");

  if (memberBtn) {
    memberBtn.href = `${window.location.origin}/profile.html${window.location.search}`;
    if (loginBtn) {
      loginBtn.removeEventListener("click", () => {
        loginContainer.style.display =
          loginContainer.style.display === "none" ? "flex" : "none";
      });
    }
  }

  memberHome.href = `${window.location.origin}/index.html${window.location.search}`;
  memberArticle.href = `${window.location.origin}/article.html${window.location.search}`;
  memberSkilltree.href = `${window.location.origin}/skilltree.html${window.location.search}`;

  if (loginBtn) {
    loginBtn.href = `${window.location.origin}/profile.html${window.location.search}`;
    loginBtn.innerHTML = "會員";
  }
} else {
  // Login page
  const loginBtn = document.querySelector("#login-btn");
  const loginContainer = document.querySelector("#login-form");
  const loginCard = document.querySelector("#login-card");
  loginContainer.style.display === "none";

  loginBtn.addEventListener("click", () => {
    loginContainer.style.display =
      loginContainer.style.display === "none" ? "flex" : "none";
  });

  loginContainer.addEventListener("click", () => {
    loginContainer.style.display = "none";
  });

  loginCard.addEventListener("click", stopPropagationHandler);

  // register
  const formMail = document.querySelector("#form-input-mail");
  const formPassword = document.querySelector("#form-input-password");
  const registerBtn = document.querySelector("#register-btn");

  registerBtn.addEventListener("click", (event) => {
    event.preventDefault();
    registerWithEmailAndPassword(formMail.value, formPassword.value);
  });

  // login
  const loginBtnInner = document.querySelector("#login-btn-inner");
  loginBtnInner.addEventListener("click", (event) => {
    event.preventDefault();
    logInWithEmailAndPassword(auth, formMail.value, formPassword.value);
  });

  // login with google
  const loginGoogleBtn = document.querySelector("#login-google-btn");
  loginGoogleBtn.addEventListener("click", (event) => {
    event.preventDefault();
    signInWithGoogle();
  });

  // forget password
  const loginForgetPassword = document.querySelector(".login-forgetpassword");
  loginForgetPassword.addEventListener("click", async () => {
    await sendPasswordReset(auth, formMail.value);
  });
}
