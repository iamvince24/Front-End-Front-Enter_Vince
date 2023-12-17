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
