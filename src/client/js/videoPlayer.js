const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

const volumeDefault = 0.3;
let volumeUser = volumeDefault;
volumeRange.value = volumeDefault;
video.volume = volumeDefault;

const handlePlayBtnClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused
    ? "fa-solid fa-play"
    : "fa-solid fa-pause";
};
playBtn.addEventListener("click", handlePlayBtnClick);
video.addEventListener("click", handlePlayBtnClick);
document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    handlePlayBtnClick();
  }
});

const handleMuteBtnClick = () => {
  if (video.muted) {
    video.muted = false;
    video.volume = volumeUser;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fa-solid fa-volume-xmark"
    : "fa-solid fa-volume-high";
  volumeRange.value = video.muted ? "0" : volumeUser;
};
muteBtn.addEventListener("click", handleMuteBtnClick);
document.addEventListener("keyup", (event) => {
  if (event.code === "KeyM") {
    handleMuteBtnClick();
  }
});

const handleVolumeRangeInput = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fa-solid fa-volume-high";
  } // 볼륨이 0인 이후에 볼륨을 높이는 상황
  if (value === "0") {
    video.muted = true;
    muteBtnIcon.classList = "fa-solid fa-volume-xmark";
  } // 볼륨이 0인 상황
  video.volume = value;
};
const handleVolumeRangeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (value !== "0") {
    volumeUser = value;
  } // 한번의 드래그로 볼륨을 0으로 만들고 → 다시 음소거를 해체했을 때 → 드래그를 시작한 볼륨으로 돌아가기 위한 if문
};
volumeRange.addEventListener("input", handleVolumeRangeInput);
volumeRange.addEventListener("change", handleVolumeRangeChange);

const formatTime = (seconds) => {
  const startIdx = seconds >= 3600 ? 11 : 14;
  return new Date(seconds * 1000).toISOString().substring(startIdx, 19);
};
const handleVideoCurrentTime = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime); // 타임라인이 매초마다 영상과 함께 앞으로 증가하는 모습 표현
};
const handleVideoTotalTime = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration); // 타임라인의 영상 길이 입력
};
video.addEventListener("timeupdate", handleVideoCurrentTime);
video.addEventListener("loadedmetadata", handleVideoTotalTime);

const handleTimelineInput = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value; // 특정 타임라인을 선택하면 그에 따라 비디오 화면이 바뀌도록 함
};
timeline.addEventListener("input", handleTimelineInput);

const handleFullScreenBtn = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    fullScreenBtnIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtnIcon.classList = "fas fa-compress";
  }
};
const handleFullScreenEsc = () => {
  if (!document.fullscreenElement) {
    fullScreenBtnIcon.classList = "fas fa-expand";
  }
}; // ESC를 눌러서 전체화면을 종료했을 때의 변화 감지
fullScreenBtn.addEventListener("click", handleFullScreenBtn);
document.addEventListener("fullscreenchange", handleFullScreenEsc);
document.addEventListener("keyup", (event) => {
  if (event.code === "KeyF") {
    handleFullScreenBtn();
  }
});

let controlsTimeoutId;
let controlsTimeoutIdMove;
const hideControls = () => videoControls.classList.remove("showing");
const handleVideoContainerMousemove = () => {
  if (controlsTimeoutId) {
    clearTimeout(controlsTimeoutId);
    controlsTimeoutId = null;
  } // 3. 2번이 실행되는 동안 다시 비디오에 돌아왔을 때, 실행중인 2번 없애주기
  if (controlsTimeoutIdMove) {
    clearTimeout(controlsTimeoutIdMove);
    controlsTimeoutIdMove = null;
  } // 5. 4번이 실행되는 동안 다시 마우스가 움직이는 경우에, 실행중인 4번 없애주기
  videoControls.classList.add("showing"); // 1. 마우스가 비디오에 들어왔을 때 컨트롤바 보이기
  // volumeRange.classList.remove("showing");
  controlsTimeoutIdMove = setTimeout(hideControls, 3000); // 4. 마우스가 비디오에 들어오고, 비디오 안에서 3초 동안 아무 동작을 안 하면 컨트롤바 숨기기
};
const handleVideoContainerMouseleave = () => {
  controlsTimeoutId = setTimeout(hideControls, 1000); // 2. 마우스가 비디오에서 나갔을 때 1초 후에 컨트롤바 숨기기
};
videoContainer.addEventListener("mousemove", handleVideoContainerMousemove);
videoContainer.addEventListener("mouseleave", handleVideoContainerMouseleave);

let volumeRangeTimeoutIdMove;
let volumeRangeTimeoutId;
const hideVolumeRange = () => volumeRange.classList.remove("showing");
const handleMuteBtnMousemove = () => {
  if (volumeRangeTimeoutId) {
    clearTimeout(volumeRangeTimeoutId);
    volumeRangeTimeoutId = null;
  }
  if (volumeRangeTimeoutIdMove) {
    clearTimeout(volumeRangeTimeoutIdMove);
    volumeRangeTimeoutIdMove = null;
  }
  volumeRange.classList.add("showing");
  volumeRangeTimeoutIdMove = setTimeout(hideVolumeRange, 3000);
};
const handleMuteBtnMouseleave = () => {
  volumeRangeTimeoutId = setTimeout(hideVolumeRange, 100);
};
muteBtn.addEventListener("mousemove", handleMuteBtnMousemove);
muteBtn.addEventListener("mouseleave", handleMuteBtnMouseleave);

const handleVolumeRangeMousemove = () => {
  if (volumeRangeTimeoutId) {
    clearTimeout(volumeRangeTimeoutId);
    volumeRangeTimeoutId = null;
  }
  if (volumeRangeTimeoutIdMove) {
    clearTimeout(volumeRangeTimeoutIdMove);
    volumeRangeTimeoutIdMove = null;
  }
  volumeRange.classList.add("showing");
  volumeRangeTimeoutIdMove = setTimeout(hideVolumeRange, 3000);
};
const handleVolumeRangeMouseleave = () => {
  volumeRangeTimeoutId = setTimeout(hideVolumeRange, 100);
};
volumeRange.addEventListener("mousemove", handleVolumeRangeMousemove);
volumeRange.addEventListener("mouseleave", handleVolumeRangeMouseleave);
