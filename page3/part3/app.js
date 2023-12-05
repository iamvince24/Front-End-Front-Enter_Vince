import { fetchJsonData } from "../utils.js";

// loading handle
// document.addEventListener("DOMContentLoaded", function () {
//   setTimeout(function () {
//     document.getElementById("loading-container").style.transform =
//       "translateY(-110%)";
//     document.querySelector(".color-block-1").style.transform = "scaleY(5)";
//     document.querySelector(".color-block-2").style.transform = "scaleY(3.5)";
//     setTimeout(function () {
//       document.querySelector(".color-block-1").style.transform = "scaleY(0)";
//       document.querySelector(".color-block-2").style.transform = "scaleY(0)";
//     }, 700);
//   }, 2000);
// });

// Click search-icon
const searchButton = document.querySelector("#search-icon");
const searchContainerBlack = document.querySelector(".search-container-black");

function handleSearchContainer() {
  var searchContainer = document.querySelector("#search-container");

  if (searchContainer.style.display === "none") {
    searchContainer.style.display = "block";
  } else {
    searchContainer.style.display = "none";
  }
}

searchButton.addEventListener("click", handleSearchContainer);
searchContainerBlack.addEventListener("click", handleSearchContainer);

const topIcon = document.querySelector("#top-icon");
topIcon.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// search function
const searchInput = document.querySelector("#search-input");
const searchIconInner = document.querySelector("#search-icon-inner");

const searchFunction = async () => {
  try {
    const currentUrl = window.location.href;
    const targetUrl =
      window.location.protocol + "//" + window.location.host + "/article.html";

    if (currentUrl !== targetUrl) {
      const searchResult = searchInput.value;
      const searchParams = new URLSearchParams({
        searchResult: JSON.stringify(searchResult),
      });
      const newTargetUrl = `${targetUrl}?${searchParams.toString()}`;

      window.location.href = newTargetUrl;
    }
  } catch (error) {
    console.error("搜尋時發生錯誤:", error);
  }
};

searchIconInner.addEventListener("click", searchFunction);
searchInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchFunction();
  }
});

// Voice
const voiceIcon = document.getElementById("voice-icon");
if ("webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "zh-TW,en-US";

  recognition.onstart = function () {
    console.log("語音辨識已啟動");
  };

  recognition.onend = function () {
    console.log("語音辨識已結束");
  };

  recognition.onresult = function (event) {
    const result = event.results[0][0].transcript;
    searchInput.value = result;
    console.log("語音辨識結果：", result);
  };

  voiceIcon.addEventListener("click", function () {
    recognition.start();
  });
} else {
  alert("瀏覽器不支持語音辨識");
}

// Test go
const testGo = document.querySelectorAll("#test-go");
const testSection = document.querySelector(".testSection");

testGo.forEach((button) => {
  button.addEventListener("click", () => {
    testSection.style.display = "flex";
  });
});

testSection.addEventListener("click", () => {
  testSection.style.display = "none";
});

const testCardStart = document.querySelector(".testCard-start");
const startBtn = document.querySelector(".start-btn");
const testCardList = document.querySelector(".testCard-list");
const testCardResult = document.querySelector(".testCard-result");
const ChartScore = document.querySelector(".ChartScore");
const resultBtn = document.querySelector(".resultBtn");

const testQuestions = [
  {
    question: "選擇在哪座城市學習？",
    stage: "1/5",
    listOption: ["台北", "台中", "高雄", "各地", "不重要"],
  },
  {
    question: "每月能撥出多少費用學習？",
    stage: "2/5",
    listOption: [
      "3000元以下",
      "6000元內",
      "10000元以內",
      "10001元以上",
      "不重要",
    ],
  },
  {
    question: "每周能撥出多少時間學習？",
    stage: "3/5",
    listOption: ["16小時以下", "30小時內", "45小時內", "46小時以上", "不重要"],
  },
  {
    question: "對班制的需求是？",
    stage: "4/5",
    listOption: ["大班制", "小班制", "一對一", "不重要"],
  },
  {
    question: "喜歡什麼樣的教學方式？",
    stage: "5/5",
    listOption: ["放養制", "手把收教制", "不重要"],
  },
];

testCardStart.addEventListener("click", (event) => {
  event.stopPropagation();
});

startBtn.addEventListener("click", async () => {
  testCardStart.style.display = "none";
  testCardList.style.display = "flex";
  testCardList.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  var testCardIndex = 0;
  const answersArray = [];
  await setTestCard(testCardIndex, answersArray);
  const testFilterCondition = answersArray;
  const testResultKey = await getTestResult(testFilterCondition);
  console.log(testResultKey);

  const data = await fetchJsonData("../front-enter-export.json");
  const { city, fee, weekHour, classType, teachWay } =
    data.article[testResultKey];
  const testArray = [city, fee, weekHour, classType, teachWay];

  let commonElement = testFilterCondition.filter((value) =>
    testArray.includes(value)
  );
  const commonScore = commonElement.length / testArray.length;
  const comPercentage = (commonScore * 100).toFixed(0) + "%";

  ChartScore.innerHTML = comPercentage;
  resultBtn.innerHTML = data.article[testResultKey].name;

  resultBtn.addEventListener("click", () => {
    const contentUrl =
      window.location.protocol + "//" + window.location.host + "/content.html";
    const contentId = data.article[testResultKey].creatTime;
    const contentParams = new URLSearchParams({
      id: JSON.stringify(contentId),
    });
    const newTargetUrl = `${contentUrl}?${contentParams.toString()}`;

    window.location.href = newTargetUrl;
  });
});

async function getTestResult(answersArray) {
  const data = await fetchJsonData("../front-enter-export.json");
  const articleKeys = Object.keys(data.article);

  let answersList = articleKeys;
  let tempList = [];

  if (answersArray[1] === "3000元以下") {
    answersList = [
      "-LNiP-cd31m_XrDZJxdl",
      "-LNySD7c2UOilxjkW14U",
      "-LNyUA-GLYQyCACdkDjg",
      "-LNyYDaCeasm6O-nP8FE",
      "-LOvaej1H569KD4eXNZG",
    ];
  } else if (answersArray[1] === "6000元內") {
    answersList = [
      "-LNiP-cd31m_XrDZJxdl",
      "-LNySD7c2UOilxjkW14U",
      "-LNyUA-GLYQyCACdkDjg",
      "-LNyYDaCeasm6O-nP8FE",
      "-LOvaej1H569KD4eXNZG",
      "-LNyOk-FQnejK4pZYqAi",
      "-LNyPzKvn1h2QX_CDwET",
      "-LNy_jj1Fj-HF0XbbRtb",
      "-LO17F-h-LN77A7uHJcV",
    ];
  }
  tempList = answersList;
  if (answersList.length === 0) answersList = tempList;
  // console.log(answersList);

  answersList = answersList.filter(
    (key) =>
      answersArray[0] === "不重要" || answersArray[0] === data.article[key].city
  );
  if (answersList.length === 0) {
    answersList = tempList;
  } else {
    tempList = answersList;
  }
  // console.log(answersList);

  if (answersArray[2] === "16小時以下") {
    answersList = ["-LNiP-cd31m_XrDZJxdl", "-LNyOk-FQnejK4pZYqAi"];
  } else if (answersArray[2] === "30小時內") {
    answersList = [
      "-LNiP-cd31m_XrDZJxdl",
      "-LNyOk-FQnejK4pZYqAi",
      "-LNyPzKvn1h2QX_CDwET",
      "-LNyUA-GLYQyCACdkDjg",
      "-LNyYDaCeasm6O-nP8FE",
      "-LO17F-h-LN77A7uHJcV",
      "-LOvaej1H569KD4eXNZG",
    ];
  }
  if (answersList.length === 0) {
    answersList = tempList;
  } else {
    tempList = answersList;
  }
  // console.log(answersList);

  answersList = answersList.filter(
    (key) =>
      answersArray[3] === "不重要" ||
      answersArray[3] === data.article[key].classType
  );
  if (answersList.length === 0) {
    answersList = tempList;
  } else {
    tempList = answersList;
  }
  // console.log(answersList);

  answersList = answersList.filter(
    (key) =>
      answersArray[4] === "不重要" ||
      answersArray[4] === data.article[key].teachWay
  );
  if (answersList.length === 0) {
    answersList = tempList;
  } else {
    tempList = answersList;
  }
  // console.log(answersList);

  return answersList[0];
}

function setTestCard(i, answersArray) {
  return new Promise((resolve) => {
    testCardList.innerHTML = `
      <div class="list-question">${testQuestions[i].question}</div>
      <div class="list-stage">${testQuestions[i].stage}</div>
      <div class="list-optionContainer"></div>
    `;

    const listOptionContainer = document.querySelector(".list-optionContainer");
    testQuestions[i].listOption.forEach((option) => {
      listOptionContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="list-option click-effect">${option}</button>`
      );
    });

    const listOption = document.querySelectorAll(".list-option");
    listOption.forEach((button) => {
      button.addEventListener("click", () => {
        answersArray.push(button.innerHTML);
        i += 1;

        if (i <= 4) {
          // 遞歸調用 setTestCard，並在點擊事件處理完成後 resolve Promise
          setTestCard(i, answersArray).then(() => {
            resolve();
          });
        } else {
          // console.log(answersArray);
          testCardResult.style.display = "flex";
          testCardList.style.display = "none";
          // 在最後一次點擊事件處理完成後 resolve Promise
          resolve();
        }
      });
    });
  });
}
