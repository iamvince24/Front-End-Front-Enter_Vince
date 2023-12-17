// Skilltree test
const testData = {
  HTML: {
    question: "請問 HTML 是什麼？",
    1: "標籤語言",
    2: "資料庫工具",
    3: "瀏覽器規範",
    ans: 1,
    order: 1,
    text: "你通過第一關，HTML 是成為前端工程師的橋頭堡，也是網站給人的第一印象，一定要學好才行。",
  },
  CSS: {
    question: "SCSS 跟 CSS 差別？",
    1: "SCSS 用變數控制",
    2: "SCSS 非縮排語法",
    3: "不同程式語言",
    ans: 1,
    order: 2,
    text: "哇，你竟然連 CSS 也略懂略懂。如果階層樣式學得好，就具備基礎網頁設計師的能力了，這時候，對於細節的掌握就更加重要囉。",
  },
  JavaScript: {
    question: "何者非 JS 定義變數的方式？",
    1: "function",
    2: "var",
    3: "let",
    ans: 1,
    order: 3,
    text: "恭喜你通過 JavaScript 關卡。JavaScript 也是小編最喜歡的語言，掌握它，就等於邁入前端工程師的行列，它不只能為你帶來一份工作，也擴展你的視野，擁有接軌科技的能力。",
  },
  RWD: {
    question: "如何在不同螢幕寬度下改變樣式？",
    1: "透過 media 操作",
    2: "使用事件物件",
    3: "變數控制",
    ans: 1,
    order: 4,
    text: "RWD 很神奇吧，它讓你在手機、平板上，都能方便觀看網頁，而不用放大縮小視窗，是讓使用者體驗升級的良方。",
  },
  jQuery: {
    question: "jQuery 與 JS 之比較何者正確？",
    1: "jQuery 含錢字符號",
    2: "JS 是一種框架",
    3: "jQuery 並未開源",
    ans: 1,
    order: 5,
    text: "jQuery 是相當方便的 JavaScript 函式庫，它幫你把程式封裝好，只要加上經典的 $ 字號作為前綴，就能使用眾多功能。",
  },
  GitHub: {
    question: "GitHub 不能做什麼？",
    1: "測試程式正確性",
    2: "程式碼倉庫",
    3: "共同軟體開發",
    ans: 1,
    order: 6,
    text: "在學習程式語言之前，很難想像有 GitHub 的存在吧，竟然有個倉庫專門在管理程式語言，還能讓人複製、共同編輯，並記錄每一次的 commit ，是一款優秀的協作工具。",
  },
  SCSS: {
    question: "何者不屬於 CSS 預處理器？",
    1: "Gulp",
    2: "SCSS",
    3: "PostCSS",
    ans: 1,
    order: 7,
    text: "css 屬於程式設計入門款，而預處理器能以更有效率的方式，撰寫階層樣式，如果你擁有 JavaScript 的基本概念，學起來會特別快唷。",
  },
  Bootstrap: {
    question: "Bootstrap 是一種？",
    1: "樣式擴充元件",
    2: "打包工具",
    3: "套件管理工具",
    ans: 1,
    order: 8,
    text: "看來你學蠻快的，Bootstrap 能做到的，css 也能做到，如果有時間，不仿試試手刻 Bootstrap 的特效，精進樣式調校的能力。",
  },
  Webpack: {
    question: "使用 Webpack 需要安裝？",
    1: "Node.js",
    2: "Babel",
    3: "Styled-components",
    ans: 1,
    order: 9,
    text: "你已經越來越厲害，掌握了近期火紅的打包工具，Webpack 和 React 是絕配，是幫助瀏覽器進行「翻譯」的良方。",
  },
  React: {
    question: "React 有何特性？？",
    1: "建置單頁式網站",
    2: "不存在異步問題",
    3: "不需要 Babel 編譯",
    ans: 1,
    order: 10,
    text: "你太強了，React 是不容易掌握的框架，能讓使用者的體驗更好，你所使用的 facebook 就是運用這套框架呢。",
  },
  UnitTest: {
    question: "為什麼要做單元測試？",
    1: "確保程式邏輯正確",
    2: "讓 Scrum 運作順利",
    3: "資料安全性",
    ans: 1,
    order: 11,
    text: "終於抵達最後一關了，單元測試是為了確保函式的正確性，而進行的作業。雖然單元測試是最後一關，但工程的世界無止盡，身為一位 geek 就是要不斷學習精進唷。",
  },
};

class SkillHandler {
  constructor(skill, skillId, cardId) {
    this.skill = document.querySelector(`${skillId}`);
    this.card = document.querySelector(`${cardId}`);

    this.testSection = document.querySelector(".skill-test-section");
    this.optionTitle = document.querySelector("#question-title");
    this.option1 = document.querySelector("#question-option-1");
    this.option2 = document.querySelector("#question-option-2");
    this.option3 = document.querySelector("#question-option-3");
    this.animation = document.querySelector("#correct-answer-animation");
    this.animationText = document.querySelector("#correct-ans-text");

    this.skilltreeIconContainer = document.querySelector(
      ".skilltree-icon-container"
    );
    this.skilltreeContainer = document.querySelector(".skilltree-container");

    this.skill.addEventListener("mouseover", () => this.showCard());
    this.skill.addEventListener("mouseout", () => this.closeCard());
  }

  showCard() {
    this.card.style.display = "block";
  }

  closeCard() {
    this.card.style.display = "none";
  }

  setDisplay(element) {
    element.style.display = "flex";
  }

  setDisplayNone(element) {
    element.style.display = "none";
  }

  async setClickDisplayEvent(skill) {
    this.skill.addEventListener("click", async () => {
      await this.showTestCard(skill);
    });
  }

  removeClickEvent(skill) {
    this.skill.removeEventListener("click", () => this.showTestCard(skill));
  }

  async showTestCard(skill) {
    this.optionTitle.innerHTML = testData[skill].question;
    this.option1.innerHTML = testData[skill][1];
    this.option2.innerHTML = testData[skill][2];
    this.option3.innerHTML = testData[skill][3];
    this.testSection.style.display = "flex";
    // await this.setAnswerClickEvent(skill);
    // await this.setWrongClickEvent(skill);
  }

  async setAnswerClickEvent(skill) {
    const ansOption = "option" + `${testData[skill].ans}`;
    const ansElement = this[ansOption];

    return new Promise((resolve) => {
      ansElement.addEventListener("click", async () => {
        this.setDisplay(this.animation);
        this.applyCorrectOptionStyles(ansElement);
        await this.animateTextWithSound(testData[skill]["text"]);
        this.animation.addEventListener("click", () => {
          this.setDisplayNone(this.animation);
          this.skilltreeIconContainer.parentNode.removeChild(
            this.skilltreeIconContainer
          );
          resolve();
        });
      });
    });
  }

  async setWrongClickEvent(skill) {
    const correctOption = testData[skill].ans;
    const wrongOptions = [1, 2, 3].filter((option) => option !== correctOption);

    for (const option of wrongOptions) {
      const optionName = "option" + `${option}`;
      const optionElement = this[optionName];
      optionElement.addEventListener("click", async () => {
        await this.applyWrongOptionStyles(optionElement);
      });
    }
  }

  applyCorrectOptionStyles(optionElement) {
    optionElement.style.background = `url(../img/correct-icon.svg) 4% 50% / contain no-repeat rgba(255, 255, 255, 0.8)`;
    optionElement.style.backgroundSize = "20px 20px";
  }

  async applyWrongOptionStyles(optionElement) {
    optionElement.classList.add("shakeAnimation");
    optionElement.style.background = `url(../img/wrong-icon.svg) 4% 50% / contain no-repeat rgba(255, 255, 255, 0.8)`;
    optionElement.style.backgroundSize = "20px 20px";
  }

  async animateTextWithSound(text) {
    const typingSound = new Audio("../img/typing.mp3");
    let index = 0;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    while (index < text.length) {
      this.animationText.innerHTML += text.charAt(index);
      typingSound.play();
      index++;
      await delay(100);
    }

    typingSound.pause();
  }

  // insertIconContainerBeforeSkill(skill) {
  //   this.skill.parentNode.insertBefore(
  //     this.skill,
  //     document.querySelector(`.skilltree-skill-${skill}`)
  //   );
  // }
}

// Skilltree icon display
const skilltreeIconDisplay = document.querySelector("#skilltree-icon-display");
const iconWindow = document.querySelector("#icon-window");
const iconBox = document.querySelector(".icon-box");
const iconSelect = document.querySelectorAll(".icon-select");

skilltreeIconDisplay.addEventListener("click", () => {
  iconWindow.style.display = "flex";
});

iconWindow.addEventListener("click", () => {
  iconWindow.style.display = "none";
});

iconBox.addEventListener("click", (event) => {
  event.stopPropagation();
});

iconSelect.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    skilltreeIconDisplay.src = icon.src;
    iconWindow.style.display = "none";
  });
});

// Skilltree skills
const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "jQuery",
  "RWD",
  "GitHub",
  "Webpack",
  "SCSS",
  "React",
  "Bootstrap",
  "UnitTest",
];

// skills.forEach((skill) => {
//   new SkillHandler(`${skill}`, `#skill-${skill}`, `#skill-${skill}-card`);
// });

const newElement = document.createElement("div");
newElement.className = "skilltree-icon-container";
newElement.innerHTML = `
  <img
    class="skilltree-icon"
    id="skilltree-icon-display"
    src="https://frankyeah.github.io/Front-Enter/images/cute.svg"
    style="width: 40px"
  />
  <div id="icon-window" style="display: none">
    <div class="icon-box" id="icon-box">
      <p>請選擇 Icon</p>
      <div class="icon-img-container">
        <img
          class="skilltree-icon icon-select"
          id="icon-1"
          src="https://frankyeah.github.io/Front-Enter/images/cute.svg"
        />
        <img
          class="skilltree-icon icon-select"
          id="icon-2"
          src="https://frankyeah.github.io/Front-Enter/images/cute2.svg"
        />
        <img
          class="skilltree-icon icon-select"
          id="icon-3"
          src="https://frankyeah.github.io/Front-Enter/images/cute3.svg"
        />
      </div>
    </div>
  </div>
`;
///

document.querySelector("#skill-HTML").classList.add("skilltree-focus");

document.querySelector(".skill-test-section").addEventListener("click", () => {
  document.querySelector(".skill-test-section").style.display = "none";
});

document
  .querySelector(".test-card-question")
  .addEventListener("click", (event) => {
    event.stopPropagation();
  });

const skilltreeIconContainer = document.querySelector(
  ".skilltree-icon-container"
);

const con = document.querySelector("#con");

async function testfuncition() {
  const htmlSkillHandler = new SkillHandler(
    "HTML",
    "#skill-HTML",
    "#skill-HTML-card"
  );
  htmlSkillHandler.setClickDisplayEvent("HTML");
  htmlSkillHandler.setWrongClickEvent("HTML");
  await htmlSkillHandler.setAnswerClickEvent("HTML");
  let targetElement = document.querySelector("#skill-CSS");
  targetElement.parentNode.insertBefore(newElement, targetElement);

  const CSSSkillHandler = new SkillHandler(
    "CSS",
    "#skill-CSS",
    "#skill-CSS-card"
  );
  CSSSkillHandler.setClickDisplayEvent("CSS");
  CSSSkillHandler.setWrongClickEvent("CSS");
  await CSSSkillHandler.setAnswerClickEvent("CSS");
  targetElement = document.querySelector("#skill-JavaScript");
  targetElement.parentNode.insertBefore(newElement, targetElement);

  console.log("123");
}

testfuncition();
