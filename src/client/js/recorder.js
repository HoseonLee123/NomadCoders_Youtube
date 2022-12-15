const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
const init = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    video.srcObject = stream;
    video.play();
  } catch (error) {
    startBtn.disabled = true;
  }
};

let recorder;
const handleStartBtnStart = async () => {
  await init();
  if (startBtn.disabled) {
    alert("Sorry, but no suitable device was found.");
  } else {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStartBtnStart);
    startBtn.addEventListener("click", handleStartBtnStop);

    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      const videoFile = URL.createObjectURL(event.data);
      video.srcObject = null;
      video.src = videoFile;
      video.loop = true;
      video.play();
    };
    recorder.start();
  }
};

const handleStartBtnStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStartBtnStop);
  startBtn.addEventListener("click", handleStartBtnDownload);

  recorder.stop();
};

const handleStartBtnDownload = () => {};

startBtn.addEventListener("click", handleStartBtnStart);
