import { contactMessage } from "./firebase.js";
import { alertMessage } from "./common.js";

const formButton = document.querySelector(".form-button");

formButton.addEventListener("click", async function (event) {
  event.preventDefault();

  if (
    document.getElementById("input-name").value &&
    document.getElementById("input-mail").value &&
    document.getElementById("input-topic").value &&
    document.getElementById("input-content").value
  ) {
    await contactMessage([
      document.getElementById("input-name").value,
      document.getElementById("input-mail").value,
      document.getElementById("input-topic").value,
      document.getElementById("input-content").value,
    ]);
  } else {
    alertMessage("Error!", "請確實填寫表格");
  }
});

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  var map = new Map(document.querySelector(".map-google"), {
    center: { lat: 25.026768723667754, lng: 121.52985035203837 },
    zoom: 16,
    mapTypeControl: false,
  });

  var marker = new google.maps.Marker({
    position: { lat: 25.026768723667754, lng: 121.52985035203837 },
    map: map,
    title: "Front-End Enter",
  });
}

initMap();
