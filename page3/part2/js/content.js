import { fetchJsonData } from "../utils.js";

// KeyVisual DOM
const articleKeyvisual = document.querySelector(".article-keyvisual");
const articleKeyvisualContent = document.querySelector(
  ".article-keyvisual-content"
);

// Content DOM
const tableContainer = document.querySelector(".content-tableContainer");
const contentTitle = document.querySelector(".content-title");
const contentText = document.querySelector(".content-text");

// FetchData
const fetchData = async () => {
  // Get Url Id
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = JSON.parse(urlParams.get("id"));

  if (idParam) {
    // Setting Data
    try {
      const data = await fetchJsonData("../front-enter-export.json");
      const articleKeys = Object.keys(data.article);
      let targetKey = "";

      articleKeys.forEach((key) => {
        if (idParam === data.article[key].creatTime) {
          targetKey = key;
        }
      });

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
      } = data.article[targetKey];

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
    } catch (error) {
      console.error("載入資料時發生錯誤:", error);
    }
  } else {
    console.error("未找到 ID 參數");
  }
};

fetchData();

// Picture slide
const contentImg = document.querySelectorAll(".content-img");
const contentImgElement = document.querySelectorAll(".content-imgElement");
const imgDisplayContainer = document.querySelector(".imgDisplayContainer");
const imgDisplay = document.querySelector(".imgDisplay");
const imgDisplayImg = document.querySelector(".imgDisplay-img");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");

contentImg.forEach((img) => {
  img.addEventListener("click", (event) => {
    imgDisplay.style.display = "flex";
  });
});

contentImgElement.forEach((img) => {
  img.addEventListener("click", (event) => {
    imgDisplayImg.src = img.src;
  });
});

imgDisplay.addEventListener("click", () => {
  imgDisplay.style.display = "none";
});

imgDisplayContainer.addEventListener("click", (event) => {
  event.stopPropagation();
});

const imgList = [
  "../img/key-visual.jpg",
  "../img/second-img.jpg",
  "../img/third-img.jpg",
  "../img/four-img.jpg",
  "../img/five-img.jpg",
];

let displayIndex = 0;

function updateDisplayIndex(offset) {
  displayIndex += offset;
  displayIndex = (displayIndex + imgList.length) % imgList.length;
  imgDisplayImg.src = imgList[displayIndex];
}

leftArrow.addEventListener("click", (event) => {
  event.stopPropagation();
  updateDisplayIndex(4);
});

rightArrow.addEventListener("click", (event) => {
  event.stopPropagation();
  updateDisplayIndex(1);
});
