import { logout, readUserData, writeUserData, fetchData } from "./firebase.js";
import { setRedirectLink } from "./utils.js";

const tagPersonal = document.querySelector(".tag-personal");
const tagCollect = document.querySelector(".tag-collect");
const contentPersonal = document.querySelector(".content-personal");
const contentCollect = document.querySelector(".content-collect");
const infoBtns = document.querySelectorAll(".info-btn");
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

  // infoBtn.addEventListener("click", () => {
  //   infoInputs.forEach((infoInput) => {
  //     infoInput.classList.toggle("info-form-unedited");
  //     infoInput.classList.toggle("info-form-edited");
  //   });
  // });

  tagLogout.addEventListener("click", () => {
    window.location.href = `${window.location.origin}/index.html`;
    const articleCollectLocal = JSON.parse(
      window.localStorage.getItem("articleCollect")
    );

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
const infoCheckModifyBtn = document.querySelector("#info-check-modify-btn");
const infoCancelBtn = document.querySelector("#info-cancel-btn");

if (infoUsername) {
  infoUsername.value = username;
  infoPhone.value = phone;
  infoEmail.value = email;

  const articleCollectLocal = JSON.parse(
    window.localStorage.getItem("articleCollect")
  );
  // modify user data
  infoModifyBtn.addEventListener("click", async () => {
    infoModifyBtn.style.display = "none";
    infoCheckModifyBtn.style.display = "block";
    infoCancelBtn.style.display = "block";

    infoInputs.forEach((infoInput) => {
      infoInput.classList.toggle("info-form-unedited");
      infoInput.classList.toggle("info-form-edited");
    });
  });
  infoCheckModifyBtn.addEventListener("click", async () => {
    infoCheckModifyBtn.style.display = "none";
    infoCancelBtn.style.display = "none";
    infoModifyBtn.style.display = "block";

    infoInputs.forEach((infoInput) => {
      infoInput.classList.toggle("info-form-unedited");
      infoInput.classList.toggle("info-form-edited");
    });

    writeUserData(
      userUid,
      infoUsername.value,
      infoPhone.value,
      email,
      articleCollectLocal
    );
  });
  infoCancelBtn.addEventListener("click", async () => {
    infoCheckModifyBtn.style.display = "none";
    infoCancelBtn.style.display = "none";
    infoModifyBtn.style.display = "block";

    infoInputs.forEach((infoInput) => {
      infoInput.classList.toggle("info-form-unedited");
      infoInput.classList.toggle("info-form-edited");
    });
  });
}

// article collect
const data = await fetchData();
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
