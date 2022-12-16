import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

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
let videoFile;
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
      videoFile = URL.createObjectURL(event.data);
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

const handleStartBtnDownload = async () => {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL(mp4Blob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();
};

startBtn.addEventListener("click", handleStartBtnStart);
