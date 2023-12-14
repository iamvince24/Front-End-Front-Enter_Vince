import { setRedirectLink } from "./utils.js";
import { writeUserData, readUserData, fetchData } from "./firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const articleListContainer = document.querySelector(".articlelist");

  // Animation for article keyvisual
  setInterval(() => {
    const keyvisual = document.querySelector(".article-keyvisual");
    keyvisual.style.animationPlayState = "running";
  }, 5000);

  // Fetch data and initialize variables
  const data = await fetchData();
  const articleKeys = Object.keys(data.article);
  const urlSearchParams = new URLSearchParams(window.location.search);
  const userId = urlSearchParams.has("id")
    ? JSON.parse(urlSearchParams.get("id"))
    : null;

  const filterButtons = document.querySelectorAll(".filter-btn");

  // Set up articles and filters
  const setArticles = () => {
    const searchKeyword = urlSearchParams.has("search")
      ? JSON.parse(urlSearchParams.get("search"))
      : null;

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
    const { city, rectangleUrl, name, preface, creatTime, uid } = element;
    const newArticleItem = document.createElement("article");
    newArticleItem.classList.add("articlelist-card");

    newArticleItem.innerHTML = `
    ${
      idParam
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

    articleListContainer.appendChild(newArticleItem);

    if (idParam) {
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
          const articleCollectLocal =
            window.localStorage.getItem("articleCollect");
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
      const redirectLink = userId
        ? `${window.location.origin}/content.html?id=${userId}&content=${creatTime}`
        : setRedirectLink("content", creatTime, "content");
      window.location.href = redirectLink;
    });

    articleListContainer.appendChild(newArticleItem);
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
      const searchData = data.article;

      if (searchValue) {
        const [searchResultClass, searchResultClassKeys] = searchAllArticle(
          searchValue,
          searchData
        );

        if (searchResultClass.length !== 0) {
          searchResultClass.forEach((searchResultClass) => {
            appendArticleCard(searchResultClass, searchResultClassKeys, data);
          });
        } else {
          alert("沒有相關資料");
        }
      } else {
        alert("請輸入搜尋關鍵字");
      }
    } catch (error) {
      console.error("執行搜尋時錯誤:", error);
    }
  }

  function searchAllArticle(query, articleData) {
    // ...
  }
});
