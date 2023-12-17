import { stopPropagationHandler } from "./utils.js";
import { fetchData } from "./firebase.js";

const data = await fetchData();
const articleKeys = Object.keys(data.article);

// KeyVisual DOM
const articleKeyvisual = document.querySelector(".article-keyvisual");
const articleKeyvisualContent = document.querySelector(
  ".article-keyvisual-content"
);

// Content DOM
const tableContainer = document.querySelector(".content-table-container");
const contentTitle = document.querySelector(".content-title");
const contentText = document.querySelector(".content-text");

// Set Aritcle Content
const loadArticleContent = async () => {
  // Get UrlId
  const urlParams = new URLSearchParams(window.location.search);
  const contentId = JSON.parse(urlParams.get("content"));

  if (contentId) {
    // Setting Data
    let targetArticleKey = findArticleKeyById(data, articleKeys, contentId);

    const {
      rectangleUrl,
      name,
      topic,
      content,
      city,
      classType,
      teachWay,
      totalDay,
      weekHour,
      technology,
      mail,
      phone,
    } = data.article[targetArticleKey];

    articleKeyvisual.style.backgroundImage = `url(${rectangleUrl})`;
    articleKeyvisualContent.innerHTML = name;
    contentTitle.innerHTML = topic;
    contentText.innerHTML = content;

    tableContainer.innerHTML = `
      <div class="tableRow">
          <div class="table-title">城市</div>
          <div class="table-text">${city}</div>
      </div>
      <div class="tableRow">
          <div class="table-title">班制</div>
          <div class="table-text">${classType}</div>
      </div>
      <div class="tableRow">
          <div class="table-title">教法</div>
          <div class="table-text">${teachWay}</div>
      </div>
      <div class="tableRow">
          <div class="table-title">天數</div>
          <div class="table-text">${totalDay}</div>
      </div>
      <div class="tableRow">
          <div class="table-title">週時</div>
          <div class="table-text">${weekHour}</div>
      </div>
      <div class="tableRow">
          <div class="table-title">技術</div>
          <div class="table-text">${technology}</div>
      </div>
      <div class="tableRow">
          <div class="table-title">信箱</div>
          <div class="table-text">${mail}</div>
      </div>
      <div class="tableRow">
          <div class="table-title">電話</div>
          <div class="table-text">${phone}</div>
      </div>
      `;
  } else {
    console.error("未找到 ID 參數");
  }
};

const findArticleKeyById = (data, articleKeys, contentId) => {
  let targetArticleKey = "";

  articleKeys.forEach((key) => {
    if (contentId === data.article[key].creatTime) {
      targetArticleKey = key;
    }
  });

  return targetArticleKey;
};

loadArticleContent();

// Picture Slide
const contentImg = document.querySelectorAll(".content-img");
const contentImgElement = document.querySelectorAll(".content-image-element");
const imageDisplayContainer = document.querySelector(
  ".image-display-container"
);
const imageDisplay = document.querySelector(".image-display");
const imageDisplayImage = document.querySelector(".image-display-image");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");

contentImg.forEach((img) => {
  img.addEventListener("click", () => {
    imageDisplay.style.display = "flex";
  });
});

contentImgElement.forEach((img) => {
  img.addEventListener("click", () => {
    imageDisplayImage.src = img.src;
  });
});

imageDisplay.addEventListener("click", () => {
  imageDisplay.style.display = "none";
});

imageDisplayContainer.addEventListener("click", stopPropagationHandler);

const imageSources = [
  "../img/key-visual.jpg",
  "../img/second-img.jpg",
  "../img/third-img.jpg",
  "../img/four-img.jpg",
  "../img/five-img.jpg",
];

let currentImageIndex = 0;

function updateDisplayIndex(offset) {
  currentImageIndex += offset;
  currentImageIndex =
    (currentImageIndex + imageSources.length) % imageSources.length;
  imageDisplayImage.src = imageSources[currentImageIndex];
}

leftArrow.addEventListener("click", (event) => {
  event.stopPropagation();
  updateDisplayIndex(4);
});

rightArrow.addEventListener("click", (event) => {
  event.stopPropagation();
  updateDisplayIndex(1);
});
