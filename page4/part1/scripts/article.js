import { fetchJsonData, setRedirectLink } from "./utils.js";

window.onload = function () {
  setInterval(function () {
    document.querySelector(".article-keyvisual").style.animationPlayState =
      "running";
  }, 5000);
};

const articleListContainer = document.querySelector(".articlelist");
const filterButtons = document.querySelectorAll(".filter-btn");

const setArticles = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const idParam = urlSearchParams.get("id");
  const searchKeyword = idParam ? JSON.parse(idParam) : null;

  const data = await fetchJsonData("../front-enter-export.json");
  const articleKeys = Object.keys(data.article);

  articleKeys.forEach((key) => {
    const articleCardList = data.article[key];
    appendArticleCard(articleCardList, articleKeys, data);
  });

  let filteredData = [];

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

  if (searchKeyword) {
    performSearch(searchKeyword);
  }
};

setArticles();

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

  articleListContainer.appendChild(newArticleItem);

  // Set filter button function
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

  // Set article RedirectLink
  const articleListContent = newArticleItem.querySelector(
    ".articlelist-content"
  );
  articleListContent.addEventListener("click", () => {
    window.location.href = setRedirectLink("content", creatTime);
  });
}

// Search Function
const searchInput = document.querySelector("#search-input");
const searchIconInner = document.querySelector("#search-icon-inner");

searchIconInner.addEventListener("click", () => {
  performSearch(searchInput.value);
});
searchInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    performSearch(searchInput.value);
  }
});

async function performSearch(searchValue) {
  articleListContainer.innerHTML = "";
  try {
    const fetchSearchData = async () => {
      const data = await fetchJsonData("../front-enter-export.json");
      return data;
    };
    const searchDataAll = await fetchSearchData();
    const searchData = searchDataAll.article;

    if (searchValue) {
      const [searchResultClass, searchResultClassKeys] = searchAllArticle(
        searchValue,
        searchData
      );

      if (searchResultClass.length !== 0) {
        searchResultClass.forEach((searchResultClass) => {
          appendArticleCard(
            searchResultClass,
            searchResultClassKeys,
            searchDataAll
          );
        });
      } else if (searchResultClass.length === 0) {
        alert("沒有相關資料");
      }
    } else {
      alert("沒有相關資料");
    }
  } catch (error) {
    console.error("執行搜尋時錯誤:", error);
  }
}

function searchAllArticle(query, articleData) {
  const matchingArticlesResult = [];
  const matchingArticlesResultKeys = [];

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
      matchingArticlesResult.push(articles);
      matchingArticlesResultKeys.push(articleId);
    }
  }

  return [matchingArticlesResult, matchingArticlesResultKeys];
}
