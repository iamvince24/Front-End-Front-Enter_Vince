import { setRedirectLink } from "./utils.js";
import { writeUserData, readUserData, fetchData } from "./firebase.js";

// Picture Running
window.onload = function () {
  setInterval(function () {
    document.querySelector(".article-keyvisual").style.animationPlayState =
      "running";
  }, 5000);
};

// Set DOM
const articleContainer = document.querySelector(".articlelist");
const filterButtons = document.querySelectorAll(".filter-btn");

const data = await fetchData();
const articleKeys = Object.keys(data.article);

const urlSearchParams = new URLSearchParams(window.location.search);
const userId = urlSearchParams.has("id")
  ? JSON.parse(urlSearchParams.get("id"))
  : null;

// Set ArticlesList
const setArticlesList = async () => {
  const searchKeyword = urlSearchParams.has("search")
    ? JSON.parse(urlSearchParams.get("search"))
    : null;

  articleKeys.forEach((key) => {
    const articleCardList = data.article[key];
    appendArticleCard(articleCardList, articleKeys, data);
  });

  let filteredArticleKeys = [];

  filterButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (event.target.classList.contains("filter-btn")) {
        filteredArticleKeys = filterArticlesByCondition(
          event.target,
          articleKeys,
          data
        );
        filteredArticleKeys.forEach((filteredKey) => {
          const articleCardList = data.article[filteredKey];
          appendArticleCard(articleCardList, filteredArticleKeys, data);
        });
      }
    });
  });

  if (searchKeyword) {
    searchHandler(searchKeyword);
  }
};

setArticlesList();

function filterArticlesByCondition(element, articleKeys, allData) {
  articleContainer.innerHTML = "";
  const filterCondition = element.innerHTML;
  let filterData = [];

  if (filterCondition === "全部") {
    filterData = articleKeys;
  } else if (filterCondition === "小班制" || filterCondition === "一對一") {
    filterData = articleKeys.filter(
      (key) => allData.article[key].classType === filterCondition
    );
  } else if (filterCondition === "放養制") {
    filterData = articleKeys.filter(
      (key) => allData.article[key].teachWay === filterCondition
    );
  }
  return filterData;
}

function appendArticleCard(element, filteredDataList, allData) {
  const newArticleItem = createArticleElement(element);
  articleContainer.appendChild(newArticleItem);

  if (userId) {
    handleStarClick(newArticleItem, element.creatTime, element.uid);
  }

  setFilterBtnClickListener(
    newArticleItem,
    element.city,
    filteredDataList,
    allData
  );
  setRedirectLinkClickListener(newArticleItem, userId, element.creatTime);
}

function createArticleElement({
  city,
  rectangleUrl,
  name,
  preface,
  creatTime,
}) {
  const newArticleItem = document.createElement("article");
  newArticleItem.classList.add("articlelist-card");

  newArticleItem.innerHTML = `
    ${
      userId
        ? `<img class="star-icon click-effect" id="star-btn-${creatTime}" src="../img/star-border.svg" alt="star-icon" />`
        : ""
    }
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
          src="${rectangleUrl}"
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

  return newArticleItem;
}

function handleStarClick(newArticleItem, creatTime, uid) {
  const isArticleStarred = JSON.parse(
    window.localStorage.getItem("articleCollect")
  )[uid].isStarred;

  if (isArticleStarred) {
    newArticleItem.querySelector(`#star-btn-${creatTime}`).src =
      "../img/star-background.svg";
  } else {
    newArticleItem.querySelector(`#star-btn-${creatTime}`).src =
      "../img/star-border.svg";
  }

  newArticleItem
    .querySelector(`#star-btn-${creatTime}`)
    .addEventListener("click", async () => {
      const articleCollectLocal = window.localStorage.getItem("articleCollect");
      let articleCollectArray = JSON.parse(articleCollectLocal);

      if (articleCollectArray[uid].isStarred) {
        articleCollectArray[uid].isStarred = false;
        window.localStorage.setItem(
          "articleCollect",
          JSON.stringify(articleCollectArray)
        );
        newArticleItem.querySelector(`#star-btn-${creatTime}`).src =
          "../img/star-border.svg";
      } else {
        articleCollectArray[uid].isStarred = true;
        window.localStorage.setItem(
          "articleCollect",
          JSON.stringify(articleCollectArray)
        );
        newArticleItem.querySelector(`#star-btn-${creatTime}`).src =
          "../img/star-background.svg";
      }

      await writeUserData(
        window.localStorage.getItem("UID", uid),
        null,
        null,
        null,
        articleCollectArray
      );
    });
}

function setFilterBtnClickListener(
  newArticleItem,
  city,
  filteredDataList,
  allData
) {
  const filterBtn = newArticleItem.querySelector(".filter-btn");
  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      articleContainer.innerHTML = "";
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

function setRedirectLinkClickListener(newArticleItem, userId, creatTime) {
  const articleListContent = newArticleItem.querySelector(
    ".articlelist-content"
  );
  articleListContent.addEventListener("click", () => {
    if (userId) {
      window.location.href = `${window.location.origin}/content.html?id=${userId}&content=${creatTime}`;
    } else {
      window.location.href = setRedirectLink("content", creatTime, "content");
    }
  });
}

// Search Function
const searchInput = document.querySelector("#search-input");
const searchIconInner = document.querySelector("#search-icon-inner");

searchIconInner.addEventListener("click", () => {
  searchHandler(searchInput.value);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchHandler(searchInput.value);
  }
});

async function searchHandler(searchKeyword) {
  articleContainer.innerHTML = "";
  try {
    if (searchKeyword) {
      const [matchingArticles, matchingArticlesKeys] = searchAllArticle(
        searchKeyword,
        data.article
      );

      if (matchingArticles.length !== 0) {
        matchingArticles.forEach((article) => {
          appendArticleCard(article, matchingArticlesKeys, data);
        });
      } else if (matchingArticles.length === 0) {
        alert("沒有相關資料");
      }
    } else {
      alert("沒有相關資料");
    }
  } catch (error) {
    console.error("執行搜尋時錯誤:", error);
  }
}

// Search All Articles
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
