const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

playBtn.addEventListener("click", () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
});

muteBtn.addEventListener("click", () => {});

video.addEventListener("pause", () => (playBtn.innerText = "Play"));
video.addEventListener("play", () => (playBtn.innerText = "Pause"));
