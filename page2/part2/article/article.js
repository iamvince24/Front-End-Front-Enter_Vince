window.onload = function () {
  setInterval(function () {
    document.querySelector(".article-keyvisual").style.animationPlayState =
      "running";
  }, 5000);
};

const articleListContainer = document.querySelector(".articlelist");
const filterButtons = document.querySelectorAll(".filter-btn");

const fetchData = async () => {
  const dataPath = "../front-enter-export.json";

  try {
    const response = await fetch(dataPath);
    if (!response.ok) {
      throw new Error(
        `Network response was not ok, status: ${response.status}`
      );
    }

    const data = await response.json();
    const articleKeys = Object.keys(data.article);

    for (const key in data.article) {
      const articleCardList = data.article[key];
      appendArticleCard(articleCardList, articleCardList);
    }

    var filteredData = [];

    filterButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        if (event.target.classList.contains("filter-btn")) {
          filteredData = handleFilterClick(event.target);

          filteredData.forEach((filteredKey) => {
            const articleCardList = data.article[filteredKey];
            appendArticleCard(articleCardList, filteredData);
          });
        }
      });
    });

    function handleFilterClick(element) {
      articleListContainer.innerHTML = "";
      const filterCondition = element.innerHTML;
      let filterData = [];

      if (filterCondition === "全部") {
        filterData = articleKeys;
      } else if (filterCondition === "小班制") {
        filterData = articleKeys.filter(
          (key) => data.article[key].classType === filterCondition
        );
      } else if (filterCondition === "放養制") {
        filterData = articleKeys.filter(
          (key) => data.article[key].teachWay === filterCondition
        );
      } else if (filterCondition === "一對一") {
        filterData = articleKeys.filter(
          (key) => data.article[key].classType === filterCondition
        );
      }
      return filterData;
    }

    function appendArticleCard(element, filteredDataList) {
      const { city, rectangleUrl, name, preface } = element;
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

      const filterBtn = newArticleItem.querySelector(".filter-btn");
      if (filterBtn) {
        filterBtn.addEventListener("click", () => {
          articleListContainer.innerHTML = "";
          const filterCondition = city;
          filterLocationData = filteredDataList.filter(
            (key) => data.article[key].city === filterCondition
          );
          filterLocationData.forEach((filteredKey) => {
            const articleCardList = data.article[filteredKey];
            appendArticleCard(articleCardList, filterLocationData);
          });
        });
      }
    }
  } catch (error) {
    console.error("錯誤:", error);
  }
};

fetchData();
