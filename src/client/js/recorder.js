const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handleStartBtnClick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    video.srcObject = stream;
    video.play();
  } catch (error) {
    alert("Sorry, but no suitable device was found.");
  }
};

startBtn.addEventListener("click", handleStartBtnClick);
