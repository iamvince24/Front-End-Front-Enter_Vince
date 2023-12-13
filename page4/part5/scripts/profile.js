import { logout, readUserData, writeUserData } from "./firebase.js";
import { fetchJsonData } from "./utils.js";

const tagPersonal = document.querySelector(".tag-personal");
const tagCollect = document.querySelector(".tag-collect");
const contentPersonal = document.querySelector(".content-personal");
const contentCollect = document.querySelector(".content-collect");
const infoBtn = document.querySelector(".info-btn");
const infoInputs = document.querySelectorAll(".info-input");
const tagLogout = document.querySelector(".tag-logout");

if (tagPersonal) {
  tagPersonal.addEventListener("click", () => {
    contentCollect.style.display = "none";
    contentPersonal.style.display = "flex";
    infoInputs.forEach((infoInput) => {
      infoInput.classList.remove("info-form-edited");
      infoInput.classList.add("info-form-unedited");
    });
  });

  tagCollect.addEventListener("click", () => {
    contentPersonal.style.display = "none";
    contentCollect.style.display = "flex";
  });

  infoBtn.addEventListener("click", () => {
    infoInputs.forEach((infoInput) => {
      infoInput.classList.toggle("info-form-unedited");
      infoInput.classList.toggle("info-form-edited");
    });
  });

  tagLogout.addEventListener("click", () => {
    window.location.href = `${window.location.origin}/index.html`;
    const articleCollectLocal = window.localStorage.getItem("articleCollect");
    writeUserData(null, null, null, null, articleCollectLocal);
    localStorage.removeItem("id");
    localStorage.removeItem("articleCollect");
    logout();
  });
}

// fetch user data
const userUid = window.localStorage.getItem("UID");
const [username, email, phone] = await readUserData(userUid);
const infoUsername = document.querySelector("#info-username");
const infoPhone = document.querySelector("#info-phone");
const infoEmail = document.querySelector("#info-email");
const infoModifyBtn = document.querySelector("#info-modify-btn");

if (infoUsername) {
  infoUsername.value = username;
  infoPhone.value = phone;
  infoEmail.value = email;

  const articleCollectLocal = window.localStorage.getItem("articleCollect");
  // modify user data
  infoModifyBtn.addEventListener("click", async () => {
    writeUserData(
      userUid,
      infoUsername.value,
      infoPhone.value,
      email,
      articleCollectLocal
    );
  });
}

// article collect
const data = await fetchJsonData("../front-enter-export.json");
const articleCollectLocal = window.localStorage.getItem("articleCollect");
let articleCollectObject = JSON.parse(articleCollectLocal);
const articleKeys = Object.keys(articleCollectObject);

if (articleCollectObject) {
  articleKeys.forEach((key) => {
    if (articleCollectObject[key].isStarred) {
      const articleElement = data.article[key];
      appendCollectArticle(articleElement);
    }
  });
}

function appendCollectArticle(articleInfo) {
  const { rectangleUrl, name, uid, creatTime } = articleInfo;
  const newArticleItem = document.createElement("div");
  newArticleItem.classList.add("collect-articlecard");

  newArticleItem.innerHTML = `
    <div class="collect-articlecard">
      <div class="collect-pic" style="background-image: url(${rectangleUrl});"></div>
      <div class="collect-article-name">${name}</div>
      <img
        class="collect-delete-icon"
        id="collect-delete-icon-${creatTime}"
        src="./img/rubbish-bin.svg"
        alt="profile-logo"
      />
    </div>
  `;

  contentCollect.appendChild(newArticleItem);

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

      const articleKeys = Object.keys(articleCollectObject);
      contentCollect.innerHTML = "";
      articleKeys.forEach((key) => {
        if (articleCollectObject[key].isStarred) {
          const articleElement = data.article[key];
          appendCollectArticle(articleElement);
        }
      });
    });
}
