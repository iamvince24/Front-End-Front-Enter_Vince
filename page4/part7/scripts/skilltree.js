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
