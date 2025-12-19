const audioPlayer = document.getElementById("audioPlayer");
const songGrid = document.getElementById("songGrid");
const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
const nowPlayingArtist = document.getElementById("nowPlayingArtist");
const nowPlayingArt = document.getElementById("nowPlayingArt");
const customProgress = document.getElementById("custom-progress");
const customProgressBar = document.getElementById("custom-progress-bar");

const baseURL = "songs";
let currentTrack = 0;
let isPlaying = false;

const songs = [
  {
    file: "Aidan.mp3",
    albumArt: "Aidan.jpg",
    title: "Aidan",
    artist: "Various",
  },
  {
    file: "autumn_sun.mp3",
    albumArt: "autumn_sun.png",
    title: "Autumn Sun",
    artist: "Instrumental",
  },
  {
    file: "best_part_of_me.mp3",
    albumArt: "BestPart.jpg",
    title: "Best Part Of Me",
    artist: "Artist",
  },
  {
    file: "Better Days - LAKEY INSPIRED.mp3",
    albumArt: "Better Days.jpg",
    title: "Better Days",
    artist: "LAKEY INSPIRED",
  },
  {
    file: "i_cant_make_you_love_me_cover.mp3",
    albumArt: "i_cant_make_you_love_me_cover.jpeg",
    title: "I Can't Make You Love Me",
    artist: "Cover",
  },
  {
    file: "just_relax.mp3",
    albumArt: "justRelax_img.jpeg",
    title: "Just Relax",
    artist: "Chill",
  },
  {
    file: "paranormal-is-real-leonell-cassio.mp3",
    albumArt: "paranormal_real_500.jpg",
    title: "Paranormal Is Real",
    artist: "Leonell Cassio",
  },
  {
    file: "Polarity.mp3",
    albumArt: "Polarity.jpg",
    title: "Polarity",
    artist: "Artist",
  },
];

function renderSongGrid() {
  const html = songs
    .map((s, i) => {
      return `
        <article class="bg-slate-800/60 rounded-xl overflow-hidden shadow-md group relative">
          <img src="albumart/${s.albumArt}" alt="${s.title}" class="w-full h-44 object-cover" />
          <div class="p-4">
            <h3 class="font-semibold truncate">${s.title}</h3>
            <p class="text-sm text-amber-200/70">${s.artist}</p>
          </div>
          <button data-index="${i}" class="play-card absolute right-3 bottom-3 bg-amber-400 p-2 rounded-full shadow-md transform transition-transform group-hover:scale-105">
            <i data-lucide="play"></i>
          </button>
        </article>
      `;
    })
    .join("\n");

  songGrid.innerHTML = html;

  // If lucide is available, generate icons for dynamically added markup
  if (window.lucide && typeof lucide.createIcons === "function") {
    lucide.createIcons();
  } else {
    window.addEventListener(
      "load",
      () => window.lucide && lucide.createIcons()
    );
  }
}

function playCurrentTrack() {
  const track = songs[currentTrack];
  audioPlayer.src = `${baseURL}/${track.file}`;
  audioPlayer.load();
  audioPlayer.play();
  isPlaying = true;
  updatePlayerUI();
}

function pauseTrack() {
  audioPlayer.pause();
  isPlaying = false;
  updatePlayerUI();
}

function togglePlay() {
  if (!audioPlayer.src) playCurrentTrack();
  else if (audioPlayer.paused) audioPlayer.play();
  else audioPlayer.pause();
}

function updatePlayerUI() {
  const track = songs[currentTrack];
  nowPlayingTitle.textContent = track.title;
  nowPlayingArtist.textContent = track.artist;
  nowPlayingArt.src = `albumart/${track.albumArt}`;

  // Update play/pause icon
  if (audioPlayer.paused) {
    playPauseIcon.setAttribute("data-feather", "play");
    playPauseIcon.setAttribute("data-lucide", "play");
    playPauseIcon.innerHTML = "";
    if (window.lucide && typeof lucide.createIcons === "function")
      lucide.createIcons();
  } else {
    playPauseIcon.setAttribute("data-feather", "pause");
    playPauseIcon.setAttribute("data-lucide", "pause");
    playPauseIcon.innerHTML = "";
    if (window.lucide && typeof lucide.createIcons === "function")
      lucide.createIcons();
  }
}

// Render UI and attach events
renderSongGrid();

// Delegate clicks on play buttons in the grid
songGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".play-card");
  if (!btn) return;
  const index = Number(btn.getAttribute("data-index"));
  if (!Number.isNaN(index)) {
    currentTrack = index;
    playCurrentTrack();
  }
});

playPauseBtn.addEventListener("click", () => {
  if (audioPlayer.paused) audioPlayer.play();
  else audioPlayer.pause();
});

prevBtn.addEventListener("click", () => {
  currentTrack = (currentTrack - 1 + songs.length) % songs.length;
  playCurrentTrack();
});

nextBtn.addEventListener("click", () => {
  currentTrack = (currentTrack + 1) % songs.length;
  playCurrentTrack();
});

// Progress handling
audioPlayer.addEventListener("timeupdate", () => {
  const pct = (audioPlayer.currentTime / (audioPlayer.duration || 1)) * 100;
  customProgressBar.style.width = `${pct}%`;

  console.log(`${audioPlayer.currentTime} / ${audioPlayer.duration}`);
  // Reintroduce the original (buggy) behavior: gradually increase playbackRate each timeupdate
  audioPlayer.playbackRate += 0.01;
});

customProgress.addEventListener("click", (e) => {
  const rect = customProgress.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const pct = x / rect.width;
  audioPlayer.currentTime = pct * (audioPlayer.duration || 0);
});

// Keep playbackRate normal (remove accidental increment in old code)
// Keyboard shortcuts
document.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case " ":
      event.preventDefault();
      audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
      break;
    case "m":
      audioPlayer.muted = !audioPlayer.muted;
      break;
    case "arrowright":
      audioPlayer.currentTime = Math.min(
        audioPlayer.currentTime + 10,
        audioPlayer.duration || audioPlayer.currentTime
      );
      break;
    case "arrowleft":
      audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 10, 0);
      break;
  }
});

// Advance on end
audioPlayer.addEventListener("ended", () => {
  currentTrack = (currentTrack + 1) % songs.length;
  playCurrentTrack();
});

// Update UI when play/pause state changes
audioPlayer.addEventListener("play", updatePlayerUI);
audioPlayer.addEventListener("pause", updatePlayerUI);

// Initial UI state
updatePlayerUI();
