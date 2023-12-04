import { fetchJsonData } from "../utils.js";

window.onload = function () {
  setInterval(function () {
    document.querySelector(".article-keyvisual").style.animationPlayState =
      "running";
  }, 5000);
};

const articleListContainer = document.querySelector(".articlelist");
const filterButtons = document.querySelectorAll(".filter-btn");

const fetchData = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const searchResultParam = urlSearchParams.get("searchResult");
  const searchResult = searchResultParam ? JSON.parse(searchResultParam) : null;

  if (!searchResult) {
    try {
      const data = await fetchJsonData("../front-enter-export.json");
      const articleKeys = Object.keys(data.article);

      articleKeys.forEach((key) => {
        const articleCardList = data.article[key];
        appendArticleCard(articleCardList);
      });

      var filteredData = [];

      filterButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          if (event.target.classList.contains("filter-btn")) {
            filteredData = handleFilterClick(event.target, articleKeys, data);
            filteredData.forEach((filteredKey) => {
              const articleCardList = data.article[filteredKey];
              appendArticleCard(articleCardList, filteredData, data);
            });
          }
        });
      });
    } catch (error) {
      console.error("載入資料時發生錯誤:", error);
    }
  } else {
    try {
      const data = await fetchJsonData("../front-enter-export.json");
      const articleKeys = Object.keys(data.article);

      articleKeys.forEach((key) => {
        const articleCardList = data.article[key];
        appendArticleCard(articleCardList);
      });

      var filteredData = [];

      filterButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          if (event.target.classList.contains("filter-btn")) {
            filteredData = handleFilterClick(event.target, articleKeys, data);
            filteredData.forEach((filteredKey) => {
              const articleCardList = data.article[filteredKey];
              appendArticleCard(articleCardList, filteredData, data);
            });
          }
        });
      });
    } catch (error) {
      console.error("載入資料時發生錯誤:", error);
    }
    articleListContainer.innerHTML = "";
    performSearch(searchResult);
  }
};

function handleFilterClick(element, articleKeys, allData) {
  articleListContainer.innerHTML = "";
  const filterCondition = element.innerHTML;
  let filterData = [];

  if (filterCondition === "全部") {
    filterData = articleKeys;
  } else if (filterCondition === "小班制") {
    filterData = articleKeys.filter(
      (key) => allData.article[key].classType === filterCondition
    );
  } else if (filterCondition === "放養制") {
    filterData = articleKeys.filter(
      (key) => allData.article[key].teachWay === filterCondition
    );
  } else if (filterCondition === "一對一") {
    filterData = articleKeys.filter(
      (key) => allData.article[key].classType === filterCondition
    );
  }
  return filterData;
}

function appendArticleCard(element, filteredDataList, allData) {
  const { city, rectangleUrl, name, preface, creatTime } = element;
  const newArticleItem = document.createElement("article");
  newArticleItem.classList.add("articlelist-card");

  function redirectToContent() {
    window.location.href = "content.html";
  }

  newArticleItem.innerHTML = `
      <div class="location">
        <img
          class="location-icon"
          src="../img/One-location-icon.png"
          alt="location-icon"
        />
        <div class="click-effect filter-btn">${city}</div>
      </div>
      <div class="articlelist-content">
        <div class="articlelist-pic-container">
          <img
            class="articlelist-pic"
            src=${rectangleUrl}
            alt="articlelist-picture"
          />
        </div>
        <p class="title">${name}</p>
        <div class="text">
        ${preface}
        </div>
        <div class="articlelist-readmore">
          <div class="readmore-word">read more</div>
          <img
            class="readmore-arrow"
            src="../img/Arrow-right-one.png"
            alt="readmore-arrow"
          />
        </div>
      </div>
  `;

  const currentUrl = window.location.href;
  const targetUrl =
    window.location.protocol + "//" + window.location.host + "/article.html";

  if (currentUrl === targetUrl) {
    articleListContainer.appendChild(newArticleItem);
    const filterBtn = newArticleItem.querySelector(".filter-btn");
    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        articleListContainer.innerHTML = "";
        const filterCondition = city;
        const filterLocationData = filteredDataList.filter(
          (key) => allData.article[key].city === filterCondition
        );
        filterLocationData.forEach((filteredKey) => {
          const articleCardList = allData.article[filteredKey];
          appendArticleCard(articleCardList, filterLocationData);
        });
      });
    }
  }

  const articleListContent = newArticleItem.querySelector(
    ".articlelist-content"
  );

  const contentUrl =
    window.location.protocol + "//" + window.location.host + "/content.html";
  const contentId = creatTime;
  const contentParams = new URLSearchParams({
    id: JSON.stringify(contentId),
  });
  const newTargetUrl = `${contentUrl}?${contentParams.toString()}`;

  articleListContent.addEventListener("click", () => {
    window.location.href = newTargetUrl;
  });
}

fetchData();

// Search Function
const searchInput = document.querySelector("#search-input");
const searchIconInner = document.querySelector("#search-icon-inner");

searchIconInner.addEventListener("click", () => {
  articleListContainer.innerHTML = "";
  performSearch(searchInput.value);
});
searchInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    articleListContainer.innerHTML = "";
    performSearch(searchInput.value);
  }
});

async function performSearch(searchValue) {
  try {
    const fetchSearchData = async () => {
      const data = await fetchJsonData("../front-enter-export.json");
      return data;
    };
    const searchDataAll = await fetchSearchData();
    const searchData = searchDataAll.article;

    if (searchValue) {
      const [searchResult, searchResultKeys] = searchArticle(
        searchValue,
        searchData
      );

      if (searchResult.length !== 0) {
        searchResult.forEach((searchResultData) => {
          appendArticleCard(searchResultData, searchResultKeys, searchDataAll);
        });
      } else if (searchResult.length === 0) {
        alert("沒有相關資料");
      }
    } else {
      alert("沒有相關資料");
    }
  } catch (error) {
    console.error("執行搜尋時錯誤:", error);
  }
}

function searchArticle(query, articleData) {
  const matchingArticles = [];
  const matchingArticlesKeys = [];

  for (const articleId in articleData) {
    const articles = articleData[articleId];

    const propertiesToSearch = [
      "city",
      "rectangleUrl",
      "name",
      "preface",
      "classType",
      "skill",
      "teachWay",
      "technology",
      "topic",
    ];

    const foundInProperties = propertiesToSearch.some((property) =>
      articles[property].toLowerCase().includes(query.toLowerCase())
    );

    if (foundInProperties) {
      matchingArticles.push(articles);
      matchingArticlesKeys.push(articleId);
    }
  }

  return [matchingArticles, matchingArticlesKeys];
}
