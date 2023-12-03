// loading handle
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.getElementById("loading-container").style.transform =
      "translateY(-110%)";
    document.querySelector(".color-block-1").style.transform = "scaleY(5)";
    document.querySelector(".color-block-2").style.transform = "scaleY(3.5)";
    setTimeout(function () {
      document.querySelector(".color-block-1").style.transform = "scaleY(0)";
      document.querySelector(".color-block-2").style.transform = "scaleY(0)";
    }, 700);
  }, 2000);
});

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
