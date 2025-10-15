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
  entrance: [
    { title: "Entrance Song", file: "media/Entrance.mp3" },
    { title: "Welcome Song", file: "media/SoundHelix-Song-1.mp3" },
    { title: "Opening Tune", file: "media/SoundHelix-Song-2.mp3" },
    { title: "Grace Theme", file: "media/SoundHelix-Song-3.mp3" },
    { title: "Faith Message", file: "media/SoundHelix-Song-4.mp3" },
    { title: "Witness Jam", file: "media/SoundHelix-Song-5.mp3" },
    { title: "Praise Beat", file: "media/SoundHelix-Song-6.mp3" },
    { title: "Champion Anthem", file: "media/SoundHelix-Song-7.mp3" },
    { title: "Final Glory", file: "media/SoundHelix-Song-8.mp3" },
  ],
  sustain: [
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
  preach: [
    { title: "Prayer Ambiance Sound",   file: "media/Preach 1.mp3" },
    { title: "Relax Sustain Sound",   file: "media/Preach 2.mp3" },
    { title: "Speak Lord background Sound",   file: "media/Preach 3.mp3" },
  ],
  testimony: [
    { title: "Piano Emotional Sound 1",   file: "media/Testimony 1.mp3" },
    { title: "Piano Powerful Sound",   file: "media/Testimony 2.mp3" },
    { title: "Piano Emotional Sound 2",   file: "media/Testimony 3.mp3" },
    { title: "Piano Emotional Sound 3",   file: "media/Testimony 4.mp3" },
  ],
  victory: [
    { title: "I Am Free",   file: "media/I Am Free.mp3" },
    { title: "Ang Lahat ay Magsasaya",   file: "media/Ang Lahat ay Magsasaya.mp3" },
    { title: "Battle Cry",   file: "media/Battle Cry.mp3" },
    { title: "Break Every Chain  -  Elevation Worship",   file: "media/Break Every Chain  -  Elevation Worship.mp3" },
    { title: "Holy Forever  We Fall Down  Live Worship",   file: "media/Holy Forever  We Fall Down  Live Worship.mp3" },
    { title: "Hosanna- Starfield",   file: "media/Hosanna- Starfield.mp3" },
    { title: "I Sing Praises  LIVE  Calvary Orlando  Josue Avila",   file: "media/I Sing Praises  LIVE  Calvary Orlando  Josue Avila.mp3" },
    { title: "I Surrender - Hillsong Worship",   file: "media/I Surrender - Hillsong Worship.mp3" },
    { title: "LANGIT Instrumental by MP Music",   file: "media/LANGIT Instrumental by MP Music.mp3" },
    { title: "PUPURIHIN KA SA AWIT  DIYOS KA SA AMIN - HIS LIFE WORSHIP",   file: "media/PUPURIHIN KA SA AWIT  DIYOS KA SA AMIN - HIS LIFE WORSHIP.mp3" },
    { title: "SALAMAT SALAMAT INSTRUMENTAL",   file: "media/SALAMAT SALAMAT INSTRUMENTAL.mp3" },
    { title: "Shout to The Lord  Jesus Image  John Wilds",   file: "media/Shout to The Lord  Jesus Image  John Wilds.mp3" },
  ],
};

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
  if (tab === "sustain") {
    if (!list.length) {
      content.innerHTML = "<p style='text-align:center;opacity:0.7;'>No sustain pads yet 🎵</p>";
      return;
    }
    const grid = document.createElement("div");
    grid.className = "sustain-grid";
    list.forEach(pad => {
      const padDiv = document.createElement("div");
      padDiv.className = "pad";
      padDiv.style.setProperty("--pad-color", pad.color);
      padDiv.innerHTML = `
        <span class="pad-label">${pad.label}</span>
        <button class="pad-star">${lineup.find(s => s.title === pad.label) ? "⭐" : "☆"}</button>
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
          updatePlayerBar({ title: pad.label, file: pad.file }, audio);
        }
      });

      starBtn.addEventListener("click", e => {
        e.stopPropagation();
        const exists = lineup.find(s => s.title === pad.label);
        if (exists) {
          lineup = lineup.filter(s => s.title !== pad.label);
          starBtn.textContent = "☆";
          showModal(`❌ Removed "${pad.label}"`);
        } else {
          lineup.push({ title: pad.label, file: pad.file, type: "pad" });
          starBtn.textContent = "⭐";
          showModal(`⭐ Added "${pad.label}"`);
        }
        saveLineup();
        renderLineupSidebar();
      });

      if (lastPlaying.title === pad.label && lastPlaying.tab === "sustain") {
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
loadTab("entrance");
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
