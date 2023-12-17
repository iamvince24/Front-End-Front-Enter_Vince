import {
  fetchJsonData,
  setRedirectLink,
  stopPropagationHandler,
} from "./utils.js";

// loading handle
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".color-block-primary").style.transform = "scaleY(3)";
  document.querySelector(".color-block-secondary").style.transform =
    "scaleY(1.5)";
  setTimeout(function () {
    document.getElementById("loading-container").style.transform =
      "translateY(-100%)";
    setTimeout(function () {
      var colorBlocks = document.querySelectorAll(".color-block");
      colorBlocks.forEach(function (block) {
        block.style.transform = "scaleY(0)";
      });
    }, 500);
  }, 2000);
});

// Top Icon
const topIcon = document.querySelector("#top-icon");
topIcon.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Click search-icon
const searchButton = document.querySelector("#header-search-icon");
const searchContainer = document.querySelector("#search-container");
const searchContainerOverlay = document.querySelector(
  ".search-container-overlay"
);

const setTestCardContentDisplay = () => {
  searchContainer.style.display =
    searchContainer.style.display === "none" ? "block" : "none";
};

searchButton.addEventListener("click", setTestCardContentDisplay);
searchContainerOverlay.addEventListener("click", setTestCardContentDisplay);

// search function
const searchInput = document.querySelector("#search-input");
const searchIconInner = document.querySelector("#search-icon-inner");

const performSearchRedirect = async () => {
  const currentUrl = window.location.href;
  const targetUrl = `${window.location.origin}/article.html`;
  if (currentUrl !== targetUrl) {
    window.location.href = setRedirectLink("article", searchInput.value);
  }
};

searchIconInner.addEventListener("click", performSearchRedirect);
searchInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    performSearchRedirect();
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
const testGo = document.querySelectorAll("#aside-test-go");
const testSection = document.querySelector(".test-section");

testGo.forEach((button) => {
  button.addEventListener("click", () => {
    if (testCardList.style.display === "none") {
      testInstruction.style.display = "flex";
    }
    testSection.style.display = "flex";
  });
});

testSection.addEventListener("click", () => {
  testCardList.style.display = "none";
  testCardResult.style.display = "none";
  testSection.style.display = "none";
});

const testInstruction = document.querySelector(".test-card-instruction");
const testStartBtn = document.querySelector(".test-start-btn");
const testCardList = document.querySelector(".test-card-list");
const testCardResult = document.querySelector(".test-card-result");
const chartScore = document.querySelector(".chartScore");

testInstruction.addEventListener("click", stopPropagationHandler);
testCardList.addEventListener("click", stopPropagationHandler);
testCardResult.addEventListener("click", stopPropagationHandler);

const testQuestionsArray = [
  {
    question: "選擇在哪座城市學習？",
    stage: "1 / 5",
    listOption: ["台北", "台中", "高雄", "各地", "不重要"],
  },
  {
    question: "每月能撥出多少費用學習？",
    stage: "2 / 5",
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
    stage: "3 / 5",
    listOption: ["16小時以下", "30小時內", "45小時內", "46小時以上", "不重要"],
  },
  {
    question: "對班制的需求是？",
    stage: "4 / 5",
    listOption: ["大班制", "小班制", "一對一", "不重要"],
  },
  {
    question: "喜歡什麼樣的教學方式？",
    stage: "5 / 5",
    listOption: ["放養制", "手把收教制", "不重要"],
  },
];

testStartBtn.addEventListener("click", async () => {
  testInstruction.style.display = "none";
  testCardList.style.display = "flex";

  const [resultPercentage, resultScoreDeg, data, testResultKey] =
    await getTestResult();

  // Circle animation
  setCircleChart(resultScoreDeg);

  // Number animation
  numberAnimation(resultPercentage);

  // Btn text animation
  const resultBtn = document.querySelector(".resultBtn");
  BtnTextAnimation(data, resultBtn, testResultKey);

  // Set RedirectLink
  resultBtn.addEventListener("click", () => {
    const contentUrl = `${window.location.origin}/content.html`;
    const contentId = data.article[testResultKey].creatTime;
    const contentParams = new URLSearchParams({
      id: JSON.stringify(contentId),
    });
    const newTargetUrl = `${contentUrl}?${contentParams.toString()}`;

    window.location.href = newTargetUrl;
  });
});

async function getTestResult() {
  const answersArray = [];
  await setTestCardContent(0, answersArray);
  const testFilterCondition = answersArray;
  const testResultKey = await getTestResultKeyValue(testFilterCondition);

  const data = await fetchJsonData("../front-enter-export.json");
  const { city, fee, weekHour, classType, teachWay } =
    data.article[testResultKey];
  const testArray = [city, fee, weekHour, classType, teachWay];

  const commonElement = testFilterCondition.filter((value) =>
    testArray.includes(value)
  );

  const resultPercentage =
    ((commonElement.length / testArray.length) * 100).toFixed(0) + "%";
  const resultScoreDeg = (commonElement.length / testArray.length) * 360;

  return [resultPercentage, resultScoreDeg, data, testResultKey];
}

function setCircleChart(resultScoreDeg) {
  const resultScoreChart = document.querySelector(".resultScore-Chart");
  resultScoreChart.addEventListener("animationend", () => {
    resultScoreChart.style.background =
      "conic-gradient(" +
      `var(--dark-color) 0deg ${resultScoreDeg}deg,` +
      `var(--primary-color) ${resultScoreDeg}deg 360deg` +
      ")";
  });
}

function numberAnimation(resultPercentage) {
  let currentPercentage = 10;
  let cyclesCompleted = 0;

  const intervalIdChart = setInterval(() => {
    chartScore.innerHTML = `${currentPercentage}%`;
    currentPercentage += 10;
    if (currentPercentage > 100) {
      currentPercentage = 10;
      cyclesCompleted++;
      if (cyclesCompleted === 2) {
        clearInterval(intervalIdChart);

        chartScore.innerHTML = resultPercentage;
      }
    }
  }, 2000 / 20);
}

function BtnTextAnimation(data, resultBtn, testResultKey) {
  function displayText(index) {
    resultBtn.textContent = classList[index];
  }

  const texts = [
    "彭彭的課程教學",
    "飛肯設計學苑",
    "台大資訊系統訓練班",
    "赫綵電腦",
    "AppWorks School",
    "六角學院",
    "五倍紅寶石",
    "Udemy",
    "UXabc",
  ];

  let index = 0;
  function displayText() {
    resultBtn.textContent = texts[index];
    index = (index + 1) % texts.length;
  }
  const intervalId = setInterval(() => {
    displayText();
  }, 150);
  setTimeout(() => {
    clearInterval(intervalId);
    resultBtn.innerHTML = data.article[testResultKey].name;
  }, 2000);
}

async function getTestResultKeyValue(answersArray) {
  const data = await fetchJsonData("../front-enter-export.json");
  const articleKeys = Object.keys(data.article);

  let answersKeysArray = articleKeys;
  let tempList = [];

  if (answersArray[1] === "3000元以下") {
    answersKeysArray = [
      "-LNiP-cd31m_XrDZJxdl",
      "-LNySD7c2UOilxjkW14U",
      "-LNyUA-GLYQyCACdkDjg",
      "-LNyYDaCeasm6O-nP8FE",
      "-LOvaej1H569KD4eXNZG",
    ];
  } else if (answersArray[1] === "6000元內") {
    answersKeysArray = [
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
  tempList = answersKeysArray;
  if (answersKeysArray.length === 0) answersKeysArray = tempList;

  answersKeysArray = answersKeysArray.filter(
    (key) =>
      answersArray[0] === "不重要" || answersArray[0] === data.article[key].city
  );
  if (answersKeysArray.length === 0) {
    answersKeysArray = tempList;
  } else {
    tempList = answersKeysArray;
  }

  if (answersArray[2] === "16小時以下") {
    answersKeysArray = ["-LNiP-cd31m_XrDZJxdl", "-LNyOk-FQnejK4pZYqAi"];
  } else if (answersArray[2] === "30小時內") {
    answersKeysArray = [
      "-LNiP-cd31m_XrDZJxdl",
      "-LNyOk-FQnejK4pZYqAi",
      "-LNyPzKvn1h2QX_CDwET",
      "-LNyUA-GLYQyCACdkDjg",
      "-LNyYDaCeasm6O-nP8FE",
      "-LO17F-h-LN77A7uHJcV",
      "-LOvaej1H569KD4eXNZG",
    ];
  }
  if (answersKeysArray.length === 0) {
    answersKeysArray = tempList;
  } else {
    tempList = answersKeysArray;
  }

  answersKeysArray = answersKeysArray.filter(
    (key) =>
      answersArray[3] === "不重要" ||
      answersArray[3] === data.article[key].classType
  );
  if (answersKeysArray.length === 0) {
    answersKeysArray = tempList;
  } else {
    tempList = answersKeysArray;
  }

  answersKeysArray = answersKeysArray.filter(
    (key) =>
      answersArray[4] === "不重要" ||
      answersArray[4] === data.article[key].teachWay
  );
  if (answersKeysArray.length === 0) {
    answersKeysArray = tempList;
  } else {
    tempList = answersKeysArray;
  }

  return answersKeysArray[0];
}

function setTestCardContent(testCardIndex = 0, answersArray) {
  return new Promise((resolve) => {
    testCardList.innerHTML = `
      <div class="list-question">${testQuestionsArray[testCardIndex].question}</div>
      <div class="list-stage">${testQuestionsArray[testCardIndex].stage}</div>
      <div class="list-optionContainer"></div>
    `;

    const listOptionContainer = document.querySelector(".list-optionContainer");
    testQuestionsArray[testCardIndex].listOption.forEach((option) => {
      listOptionContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="list-option click-effect">${option}</button>`
      );
    });

    const listOption = document.querySelectorAll(".list-option");
    listOption.forEach((button) => {
      button.addEventListener("click", () => {
        answersArray.push(button.innerHTML);
        testCardIndex += 1;

        if (testCardIndex <= 4) {
          setTestCardContent(testCardIndex, answersArray).then(() => {
            resolve();
          });
        } else {
          testCardResult.style.display = "flex";
          testCardList.style.display = "none";
          resolve();
        }
      });
    });
  });
}
