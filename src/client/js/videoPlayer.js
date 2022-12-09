const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");

const volumeDefault = 0.3;
let volumeUser = volumeDefault;
volumeRange.value = volumeDefault;
video.volume = volumeDefault;

playBtn.addEventListener("click", () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
});

muteBtn.addEventListener("click", () => {
  if (video.muted) {
    video.muted = false;
    video.volume = volumeUser;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? "0" : volumeUser;
});

volumeRange.addEventListener("input", (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  } // 볼륨이 0인 이후에 볼륨을 높이는 상황
  if (value === "0") {
    video.muted = true;
    muteBtn.innerText = "Unmute";
  } // 볼륨이 0인 상황
  video.volume = value;
});

volumeRange.addEventListener("change", (event) => {
  const {
    target: { value },
  } = event;
  if (value !== "0") {
    volumeUser = value;
  } // 한번의 드래그로 볼륨을 0으로 만들고 → 다시 음소거를 해체했을 때 → 드래그를 시작한 볼륨으로 돌아가기 위한 if문
});

const formatTime = (seconds) => {
  const startIdx = seconds >= 3600 ? 11 : 14;
  return new Date(seconds * 1000).toISOString().substring(startIdx, 19);
};
video.addEventListener("timeupdate", () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
});
video.addEventListener("loadedmetadata", () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
});

timeline.addEventListener("input", (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
});

fullScreenBtn.addEventListener("click", () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Exit Full Screen";
  }
});
