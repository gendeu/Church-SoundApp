const tabs = document.querySelectorAll(".tab-btn");
const content = document.getElementById("content");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");
const modalClose = document.getElementById("modal-close");
const playerBar = document.getElementById("player-bar");
const playerTitle = document.getElementById("player-title");
const playerPlay = document.getElementById("player-play");
const playerStop = document.getElementById("player-stop");
const progressBar = document.getElementById("player-progress");
const progressTime = document.getElementById("player-time");

let currentAudio = null;
let currentSong = null;
let currentPlayBtn = null;
let lineup = JSON.parse(localStorage.getItem("lineup")) || [];
let currentTab = "lineup";
let lastPlaying = { title: null, tab: null };

// 🎵 Demo data
const musicData = {
  intro: [
    { title: "A Worship Intro by Motion Worship", file: "media/intro/A Worship Intro by Motion Worship.mp3" },
    { title: "Worship Intro", file: "media/intro/WORSHIP INTRO.mp3" },
    { title: "Worship Service Opener & Intro", file: "media/intro/WORSHIP Service Opener.mp3" },
    { title: "There's A Place For You Here", file: "media/intro/There's A Place For You Here.mp3" },
    { title: "Live For Christ Every Day Worship Opener", file: "media/intro/Live For Christ Every Day Worship Opener.mp3" },
    { title: "Are You Ready Countdown", file: "media/intro/Are You Ready Countdown.mp3" },
    { title: "We Come To Worship Intro", file: "media/intro/We Come To Worship.mp3" },
    { title: "Welcome To Our Church", file: "media/intro/Welcome To Our Church.mp3" },
    { title: "Host Entrance Background Music", file: "media/intro/Host Entrance Background Music.mp3" },
    { title: "5 Minute Church Countdown Timer", file: "media/intro/5 mins. Church countdown timer.mp3" },
    { title: "10 Second Countdown Timer", file: "media/intro/10 Second CountDown Timer.mp3" }
  ],
  pads: [
    { title: "C",   file: "media/pads/pad_C.mp3" },
    { title: "C#",  file: "media/pads/pad_Csharp.mp3" },
    { title: "D",   file: "media/pads/pad_D.mp3" },
    { title: "D#",  file: "media/pads/pad_Dsharp.mp3" },
    { title: "E",   file: "media/pads/pad_E.mp3" },
    { title: "F",   file: "media/pads/pad_F.mp3" },
    { title: "F#",  file: "media/pads/pad_Fsharp.mp3" },
    { title: "G",   file: "media/pads/pad_G.mp3" },
    { title: "G#",  file: "media/pads/pad_Gsharp.mp3" },
    { title: "A",   file: "media/pads/pad_A.mp3" },
    { title: "A#",  file: "media/pads/pad_Asharp.mp3" },
    { title: "B",   file: "media/pads/pad_B.mp3" }
  ],
  emotion: [
    { title: "Prayer Ambiance Sound",   file: "media/emotion/Preach 1.mp3" },
    { title: "Relax Sustain Sound",   file: "media/emotion/Preach 2.mp3" },
    { title: "Speak Lord background Sound",   file: "media/emotion/Preach 3.mp3" },
    { title: "Piano Emotional Sound Slow",   file: "media/emotion/Testimony 1.mp3" },
    { title: "Piano Powerful Sound",   file: "media/emotion/Testimony 2.mp3" },
    { title: "Piano Play & Sustain Emotion",   file: "media/emotion/Testimony 3.mp3" },
    { title: "Piano Emotional Sound Heavy",   file: "media/emotion/Testimony 4.mp3" },
  ],
  effects: [
    { title: "Wind Sound", file: "media/effects/Wind Sound SOUND EFFECT.mp3" },
    { title: "Thunder Sound", file: "media/effects/Thunder Sound effect.mp3" },
    { title: "Industrial Ceiling Fans", file: "media/effects/Industrial Ceiling Fans.mp3" },
    { title: "Large Crowd Applause", file: "media/effects/Large Crowd Applause.mp3" },
    { title: "Aww Sound", file: "media/effects/Aww Sound Effect.mp3" },
    { title: "Audience Clapping", file: "media/effects/Audience Clapping - Sound Effect.mp3" },
    { title: "Guitar Riff Meme", file: "media/effects/Guitar riff meme.mp3" },
    { title: "THX Deep Note", file: "media/effects/THX Deep Note.mp3" },
    { title: "Just Can't Prove It", file: "media/effects/Just can't prove it.mp3" },
    { title: "Roblox Death Sound", file: "media/effects/Roblox death sound effect.mp3" },
    { title: "MLG Air Horn", file: "media/effects/MLG AIR HORN sound effect.mp3" },
    { title: "Illuminati Confirmed", file: "media/effects/Illuminati Confirmed sound effect.mp3" },
    { title: "Air Horn Sad Violin", file: "media/effects/Air Horn Sad Violin sound effect.mp3" },
    { title: "To Be Continued", file: "media/effects/To Be Continued sound effect.mp3" },
    { title: "Aughhhhhh - Loud Snoring", file: "media/effects/Loud Snoring.mp3" },
    { title: "Taco Bell Bong", file: "media/effects/Taco Bell Bong sound effect.mp3" },
    { title: "Benny Hill Theme", file: "media/effects/Benny Hill.mp3" },
    { title: "Look At This Dude", file: "media/effects/Look At This Dude - Sound Effect [HQ].mp3" },
    { title: "Run Meme", file: "media/effects/Run Meme - Sound Effect [HQ].mp3" },
    { title: "Fail Horn", file: "media/effects/Fail Horn - Sound Effect [HQ].mp3" },
    { title: "Spongebob 2000 Years Later", file: "media/effects/2000 Years Later.mp3" },
    { title: "I have an idea - Ding Sound", file: "media/effects/Ding - Sound Effect [HQ].mp3" },
    { title: "Windows XP Shutdown", file: "media/effects/Windows XP Shutdown.mp3" },
    { title: "Final Fantasy Victory Fanfare", file: "media/effects/Final Fantasy Victory Fanfare.mp3" },
    { title: "Applause", file: "media/effects/Applause.mp3" },
    { title: "Wii Music", file: "media/effects/Wii Music - Gaming Background Music.mp3" },
    { title: "Metal Gear Solid Alert", file: "media/effects/metal gear solid sound effect (Alert).mp3" },
    { title: "Party Troll Song", file: "media/effects/party troll song by D1ofAquavibe.mp3" },
    { title: "Suspense/Dramatic Horns", file: "media/effects/Dramatic Horns.mp3" },
    { title: "Drum Roll", file: "media/effects/Drum roll sound effect.mp3" },
    { title: "Toink Sound", file: "media/effects/Toink sound effect.mp3" }
  ],
  songs: [
    { title: "I Am Free - Michael Gungor",   file: "media/songs/I Am Free.mp3" },
    { title: "You are good - Michael Gungor",   file: "media/songs/You Are Good.mp3" },
    { title: "Turn it Up - Planetshakers",   file: "media/songs/Turn It Up.mp3" },
    { title: "Ang Lahat ay Magsasaya",   file: "media/songs/Ang Lahat ay Magsasaya.mp3" },
    { title: "Battle Cry",   file: "media/songs/Battle Cry.mp3" },
    { title: "Break Every Chain  -  Elevation Worship",   file: "media/songs/Break Every Chain  -  Elevation Worship.mp3" },
    { title: "Holy Forever  We Fall Down  Live Worship",   file: "media/songs/Holy Forever  We Fall Down  Live Worship.mp3" },
    { title: "Hosanna- Starfield",   file: "media/songs/Hosanna- Starfield.mp3" },
    { title: "I Sing Praises  LIVE  Calvary Orlando  Josue Avila",   file: "media/songs/I Sing Praises  LIVE  Calvary Orlando  Josue Avila.mp3" },
    { title: "I Surrender - Hillsong Worship",   file: "media/songs/I Surrender - Hillsong Worship.mp3" },
    { title: "LANGIT Instrumental by MP Music",   file: "media/songs/LANGIT Instrumental by MP Music.mp3" },
    { title: "PUPURIHIN KA SA AWIT  DIYOS KA SA AMIN - HIS LIFE WORSHIP",   file: "media/songs/PUPURIHIN KA SA AWIT  DIYOS KA SA AMIN - HIS LIFE WORSHIP.mp3" },
    { title: "SALAMAT SALAMAT INSTRUMENTAL",   file: "media/songs/SALAMAT SALAMAT INSTRUMENTAL.mp3" },
    { title: "Shout to The Lord  Jesus Image  John Wilds",   file: "media/songs/Shout to The Lord  Jesus Image  John Wilds.mp3" },
  ],
};
// 🎵 Auto-convert Google Drive /view links to direct playable URLs
function fixGoogleDriveLinks(data) {
  Object.keys(data).forEach(section => {
    data[section] = data[section].map(item => {
      if (item.file && item.file.includes("drive.google.com/file/d/") && item.file.includes("/view")) {
        const idMatch = item.file.match(/\/d\/(.*?)\/view/);
        if (idMatch && idMatch[1]) {
          item.file = `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
        }
      }
      return item;
    });
  });
  return data;
}

// ✅ Call it right after defining musicData
fixGoogleDriveLinks(musicData);


// 🎯 Modal
function showModal(message) {
  modalText.textContent = message;
  modal.classList.remove("hidden");
}
modalClose.addEventListener("click", () => modal.classList.add("hidden"));

function saveLineup() {
  localStorage.setItem("lineup", JSON.stringify(lineup));
}

function updateAllTabs() {
  if (currentTab === "lineup") loadTab("lineup");
  else loadTab(currentTab);
}

// 🎧 Player bar controller
function updatePlayerBar(song, audio, playBtn = null) {
  playerTitle.textContent = song.title;
  playerBar.classList.remove("hidden");
  playerPlay.textContent = "⏸";
  currentAudio = audio;
  currentSong = song;
  lastPlaying = { title: song.title, tab: currentTab };
  currentPlayBtn = playBtn;

  document.querySelectorAll(".play").forEach(btn => (btn.textContent = "▶"));
  if (currentPlayBtn) currentPlayBtn.textContent = "⏸";

  playerPlay.onclick = () => {
    if (!currentAudio) return;
    if (currentAudio.paused) {
      currentAudio.play();
      playerPlay.textContent = "⏸";
      if (currentPlayBtn) currentPlayBtn.textContent = "⏸";
    } else {
      currentAudio.pause();
      playerPlay.textContent = "▶";
      if (currentPlayBtn) currentPlayBtn.textContent = "▶";
    }
  };

  playerStop.onclick = () => stopCurrentAudio(true);

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    progressTime.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
  });

  progressBar.addEventListener("input", () => {
    if (audio.duration) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
  });

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
}

function stopCurrentAudio(hideBar = false) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  document.querySelectorAll(".song").forEach(s => s.classList.remove("playing"));
  document.querySelectorAll(".pad").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".play").forEach(btn => (btn.textContent = "▶"));
  if (hideBar) playerBar.classList.add("hidden");
  currentAudio = null;
  lastPlaying = { title: null, tab: null };
  currentSong = null;
  currentPlayBtn = null;
}

// === Load tab content ===
function loadTab(tab) {
  currentTab = tab;
  content.innerHTML = "";

  const list = tab === "lineup" ? lineup : musicData[tab];

  // Sustain
  if (tab === "pads") {
    if (!list.length) {
      content.innerHTML = "<p style='text-align:center;opacity:0.7;'>No sustain pads yet 🎵</p>";
      return;
    }
    const grid = document.createElement("div");
    grid.className = "sustain-grid";
    const padColors = ["#00bfff", "#ff6600", "#ff33cc", "#33ff99", "#ffff33", "#ff3333", "#33ccff"];
    list.forEach(pad => {
      const padDiv = document.createElement("div");
      padDiv.className = "pad";
      const color = pad.color || padColors[Math.floor(Math.random() * padColors.length)];
      padDiv.style.setProperty("--pad-color", color);
      padDiv.innerHTML = `
        <span class="pad-label">${pad.title}</span>
        <button class="pad-star">${lineup.find(s => s.title === pad.title) ? "⭐" : "☆"}</button>
      `;

      const audio = new Audio(pad.file);
      audio.loop = true;
      const starBtn = padDiv.querySelector(".pad-star");

      padDiv.addEventListener("click", () => {
        if (currentAudio && currentAudio !== audio) stopCurrentAudio();
        if (currentAudio === audio && !audio.paused) {
          stopCurrentAudio(true);
          padDiv.classList.remove("active");
        } else {
          document.querySelectorAll(".pad").forEach(p => p.classList.remove("active"));
          audio.play();
          padDiv.classList.add("active");
          updatePlayerBar({ title: pad.title, file: pad.file }, audio);
        }
      });

      starBtn.addEventListener("click", e => {
        e.stopPropagation();
        const exists = lineup.find(s => s.title === pad.title);
        if (exists) {
          lineup = lineup.filter(s => s.title !== pad.title);
          starBtn.textContent = "☆";
          showModal(`❌ Removed "${pad.title}"`);
        } else {
          lineup.push({ title: pad.title, file: pad.file, type: "pad" });
          starBtn.textContent = "⭐";
          showModal(`⭐ Added "${pad.title}"`);
        }
        saveLineup();
        renderLineupSidebar();
      });

      if (lastPlaying.title === pad.title && lastPlaying.tab === "sustain") {
        padDiv.classList.add("active");
      }
      grid.appendChild(padDiv);
    });
    content.appendChild(grid);
    return;
  }

  if (!list.length) {
    content.innerHTML = "<p style='text-align:center;opacity:0.7;'>No songs yet 🎵</p>";
    return;
  }

  list.forEach(song => {
    const div = document.createElement("div");
    const isBookmarked = lineup.find(s => s.title === song.title);
    div.className = "song";
    div.innerHTML = `
      <span class="song-title">${song.type === "pad" ? "🎹" : "🔊"} ${song.title}</span>
      <div>
        <button class="play">▶</button>
        <button class="bookmark">${isBookmarked ? "⭐" : "☆"}</button>
      </div>
    `;
    if (lastPlaying.title === song.title && lastPlaying.tab === tab) div.classList.add("playing");

    const playBtn = div.querySelector(".play");
    const bookmarkBtn = div.querySelector(".bookmark");
    const audio = new Audio(song.file);
    audio.loop = true;

    playBtn.addEventListener("click", () => {
      if (currentAudio && currentAudio !== audio) stopCurrentAudio();
      if (currentAudio === audio && !audio.paused) {
        audio.pause();
        div.classList.remove("playing");
        playBtn.textContent = "▶";
        playerPlay.textContent = "▶";
        currentAudio = null;
      } else {
        document.querySelectorAll(".song").forEach(s => s.classList.remove("playing"));
        audio.play();
        div.classList.add("playing");
        playBtn.textContent = "⏸";
        updatePlayerBar(song, audio, playBtn);
      }
    });

    bookmarkBtn.addEventListener("click", () => {
      const i = lineup.findIndex(s => s.title === song.title);
      if (i === -1) {
        lineup.push(song);
        bookmarkBtn.textContent = "⭐";
        showModal(`⭐ Added "${song.title}"`);
      } else {
        lineup.splice(i, 1);
        bookmarkBtn.textContent = "☆";
        showModal(`❌ Removed "${song.title}"`);
      }
      saveLineup();
      renderLineupSidebar();
      updateAllTabs();
    });

    content.appendChild(div);
  });
}

// === Navigation ===
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadTab(btn.dataset.tab);
  });
});
loadTab("intro");
// === Mobile dropdown ===
const mobileNavTrigger = document.getElementById("mobile-nav-trigger");
const mobileNavMenu = document.getElementById("mobile-nav-menu");
const mobileNavLabel = document.getElementById("mobile-nav-label");
const arrow = document.querySelector(".arrow");

if (mobileNavTrigger && mobileNavMenu) {
  mobileNavTrigger.addEventListener("click", () => {
    mobileNavMenu.classList.toggle("hidden");
    arrow?.classList.toggle("rotated");
  });

  document.querySelectorAll(".mobile-nav-item").forEach(item => {
    item.addEventListener("click", () => {
      const tabName = item.dataset.tab;
      tabs.forEach(b => b.classList.remove("active"));
      const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
      if (btn) btn.classList.add("active");
      loadTab(tabName);
      mobileNavLabel.textContent = item.textContent;
      mobileNavMenu.classList.add("hidden");
      arrow?.classList.remove("rotated");
    });
  });
}


// === Sidebar ===
const sidebar = document.getElementById("left-panel");
const toggleSidebar = document.getElementById("toggle-sidebar");
const lineupContent = document.getElementById("lineup-content");
const showSidebarBtn = document.getElementById("show-sidebar");

toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  sidebar.classList.toggle("expanded");
  const isCollapsed = sidebar.classList.contains("collapsed");
  toggleSidebar.textContent = isCollapsed ? "⏵" : "⏴";
  showSidebarBtn.classList.toggle("hidden", !isCollapsed);
});

// 🧩 Render lineup with drag-and-drop reorder
function renderLineupSidebar() {
  lineupContent.innerHTML = "";
  if (!lineup.length) {
    lineupContent.innerHTML = `<p style="text-align:center;opacity:0.7;">No lineup yet 🎵</p>`;
    return;
  }

  lineup.forEach((song, index) => {
    const div = document.createElement("div");
    div.className = "song";
    div.draggable = true;
    div.dataset.index = index;
    div.innerHTML = `
      <span class="song-title">${song.type === "pad" ? "🎹" : "🔊"} ${song.title}</span>
      <div>
        <button class="play">▶</button>
        <button class="remove">❌</button>
        <span class="drag-handle" style="cursor:grab;">⠿</span>
      </div>
    `;
    const playBtn = div.querySelector(".play");
    const removeBtn = div.querySelector(".remove");
    const audio = new Audio(song.file);
    audio.loop = true;

    playBtn.addEventListener("click", () => {
      if (currentAudio && currentAudio !== audio) stopCurrentAudio();
      if (currentAudio === audio && !audio.paused) {
        audio.pause();
        div.classList.remove("playing");
        playBtn.textContent = "▶";
      } else {
        document.querySelectorAll(".song").forEach(s => s.classList.remove("playing"));
        audio.play();
        div.classList.add("playing");
        playBtn.textContent = "⏸";
        updatePlayerBar(song, audio, playBtn);
      }
    });

    removeBtn.addEventListener("click", () => {
      lineup = lineup.filter(s => s.title !== song.title);
      saveLineup();
      showModal(`❌ Removed "${song.title}"`);
      renderLineupSidebar();
      updateAllTabs();
    });

    if (lastPlaying.title === song.title && lastPlaying.tab === "lineup") div.classList.add("playing");

    lineupContent.appendChild(div);
  });

  // ✅ drag and drop reorder
  const items = lineupContent.querySelectorAll(".song");
  let draggedItem = null;
  items.forEach(item => {
    item.addEventListener("dragstart", () => {
      draggedItem = item;
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      draggedItem = null;
      const newOrder = Array.from(lineupContent.children).map(el => lineup[parseInt(el.dataset.index)]);
      lineup = newOrder;
      saveLineup();
      renderLineupSidebar();
    });
    item.addEventListener("dragover", e => {
      e.preventDefault();
      const target = e.target.closest(".song");
      if (target && target !== draggedItem) {
        const rect = target.getBoundingClientRect();
        const next = (e.clientY - rect.top) / rect.height > 0.5;
        lineupContent.insertBefore(draggedItem, next ? target.nextSibling : target);
      }
    });
  });
}

saveLineup = function () {
  localStorage.setItem("lineup", JSON.stringify(lineup));
  renderLineupSidebar();
};

renderLineupSidebar();

// === Floating button logic ===
showSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("collapsed");
  sidebar.classList.add("expanded");
  showSidebarBtn.classList.add("hidden");
  toggleSidebar.textContent = "⏴";
});

// === Sync mobile nav width dynamically ===
function syncMobileNavWidth() {
  const trigger = document.getElementById("mobile-nav-trigger");
  const menu = document.getElementById("mobile-nav-menu");
  if (trigger && menu) {
    const triggerWidth = trigger.offsetWidth;
    menu.style.setProperty("--trigger-width", `${triggerWidth}px`);
    menu.style.width = `${triggerWidth}px`;
  }
}
window.addEventListener("resize", syncMobileNavWidth);
window.addEventListener("load", syncMobileNavWidth);
