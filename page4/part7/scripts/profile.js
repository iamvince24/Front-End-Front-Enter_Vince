import { logout, readUserData, writeUserData, fetchData } from "./firebase.js";

const data = await fetchData();

const tagPersonal = document.querySelector(".tag-personal");
const tagCollect = document.querySelector(".tag-collect");
const contentPersonal = document.querySelector(".content-personal");
const contentCollect = document.querySelector(".content-collect");
const infoInputs = document.querySelectorAll(".info-input");
const tagLogout = document.querySelector(".tag-logout");

if (tagPersonal) {
  tagPersonal.addEventListener("click", handleTagPersonalClick);
  tagCollect.addEventListener("click", handleTagCollectClick);
  tagLogout.addEventListener("click", handleLogoutClick);
}

function handleTagPersonalClick() {
  contentCollect.style.display = "none";
  contentPersonal.style.display = "flex";
  resetInfoFormStyles();
}

function resetInfoFormStyles() {
  infoInputs.forEach((infoInput) => {
    infoInput.classList.remove("info-form-edited");
    infoInput.classList.add("info-form-unedited");
  });
}

function handleTagCollectClick() {
  contentPersonal.style.display = "none";
  contentCollect.style.display = "flex";
}

function handleLogoutClick() {
  window.location.href = `${window.location.origin}/index.html`;
  const articleCollectLocal = JSON.parse(
    window.localStorage.getItem("articleCollect")
  );
  writeUserData(null, null, null, null, articleCollectLocal);
  localStorage.removeItem("id");
  localStorage.removeItem("articleCollect");
  logout();
}

// fetch user data
const userUid = window.localStorage.getItem("UID");
const [username, email, phone] = await readUserData(userUid);
const infoUsername = document.querySelector("#info-username");
const infoPhone = document.querySelector("#info-phone");
const infoEmail = document.querySelector("#info-email");
const infoModifyBtn = document.querySelector("#info-modify-btn");
const infoCheckModifyBtn = document.querySelector("#info-check-modify-btn");
const infoCancelBtn = document.querySelector("#info-cancel-btn");

// Initialize info form
initInfoForm();

const articleCollectObject = getArticleCollectObject();
// const articleKeys = Object.keys(articleCollectObject);
if (articleCollectObject) {
  displayStarredArticles(articleCollectObject);
}

if (infoUsername) {
  // modify user data
  infoModifyBtn.addEventListener("click", async () => {
    infoModifyBtn.style.display = "none";
    infoCheckModifyBtn.style.display = "block";
    infoCancelBtn.style.display = "block";

    toggleInfoFormStyles();
  });

  infoCheckModifyBtn.addEventListener("click", async () => {
    infoCheckModifyBtn.style.display = "none";
    infoCancelBtn.style.display = "none";
    infoModifyBtn.style.display = "block";

    toggleInfoFormStyles();

    writeUserData(
      userUid,
      infoUsername.value,
      infoPhone.value,
      email,
      articleCollectObject
    );
  });
  infoCancelBtn.addEventListener("click", async () => {
    infoCheckModifyBtn.style.display = "none";
    infoCancelBtn.style.display = "none";
    infoModifyBtn.style.display = "block";

    toggleInfoFormStyles();
  });
}

function initInfoForm() {
  if (infoUsername) {
    infoUsername.value = username;
    infoPhone.value = phone;
    infoEmail.value = email;
  }
}

function getArticleCollectObject() {
  const articleCollectLocal = window.localStorage.getItem("articleCollect");
  return JSON.parse(articleCollectLocal);
}

function displayStarredArticles(articleCollectObject) {
  contentCollect.innerHTML = "";
  const articleKeys = Object.keys(articleCollectObject);
  articleKeys.forEach((key) => {
    if (articleCollectObject[key].isStarred) {
      const articleElement = data.article[key];
      appendCollectArticle(articleElement);
    }
  });
}

function toggleInfoFormStyles() {
  infoInputs.forEach((infoInput) => {
    infoInput.classList.toggle("info-form-unedited");
    infoInput.classList.toggle("info-form-edited");
  });
}

function appendCollectArticle(articleInfo) {
  const { rectangleUrl, name, uid, creatTime } = articleInfo;
  const newArticleItem = document.createElement("div");
  newArticleItem.classList.add("collect-articlecard");

  newArticleItem.innerHTML = `
    <div class="collect-articlecard">
      <div class="collect-pic collect-link-${creatTime}" id="collect-pic-${creatTime}" style="background-image: url(${rectangleUrl});"></div>
      <div class="collect-article-name collect-link-${creatTime}">${name}</div>
      <img
        class="collect-delete-icon"
        id="collect-delete-icon-${creatTime}"
        src="./img/rubbish-bin.svg"
        alt="profile-logo"
      />
    </div>
  `;

  contentCollect.appendChild(newArticleItem);

  const urlSearchParams = new URLSearchParams(window.location.search);
  const idParam = urlSearchParams.get("id");
  const userId = idParam ? JSON.parse(idParam) : null;

  document.querySelectorAll(`.collect-link-${creatTime}`).forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = `${window.location.origin}/content.html?id=${userId}&content=${creatTime}`;
    });
  });

  const articleCollectLocal = window.localStorage.getItem("articleCollect");
  let articleCollectObject = JSON.parse(articleCollectLocal);

  document
    .querySelector(`#collect-delete-icon-${creatTime}`)
    .addEventListener("click", async () => {
      articleCollectObject[uid].isStarred = false;
      window.localStorage.setItem(
        "articleCollect",
        JSON.stringify(articleCollectObject)
      );
      await writeUserData(
        window.localStorage.getItem("UID", uid),
        null,
        null,
        null,
        articleCollectObject
      );
      displayStarredArticles(articleCollectObject);
    });
}
