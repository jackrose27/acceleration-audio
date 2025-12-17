const audioPlayer = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const progressBar = document.getElementById("progress");
const customProgressBar = document.getElementById("custom-progress-bar");

const baseURL = "/songs";

let currentTrack = 0;

const songs = [
  { file: "Better Days - LAKEY INSPIRED.mp3", albulmArt: "Aiden.jpg" },
  { file: "autumn_sun.mp3", albulmArt: "BestPart.jpg" },
];

playButton.addEventListener("click", () => {
  audioPlayer.src = `${baseURL}/${songs[currentTrack].file}`;
  audioPlayer.load();
  audioPlayer.play();
});

pauseButton.addEventListener("click", () => {
  console.log("pause");
  audioPlayer.pause();
});

audioPlayer.addEventListener("timeupdate", () => {
  progressBar.value = audioPlayer.currentTime / audioPlayer.duration;
  customProgressBar.style.width = `${
    (audioPlayer.currentTime / audioPlayer.duration) * 100
  }%`;

  console.log(`${audioPlayer.currentTime} / ${audioPlayer.duration}`);

  audioPlayer.playbackRate += 0.01;
});

document.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {   
    case " ":
      event.preventDefault();
      audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
      break;

    case "m":
      audioPlayer.muted = !audioPlayer.muted;
      break;
  }
});
