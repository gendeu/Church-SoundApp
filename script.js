const tabs = document.querySelectorAll(".tab-btn");
const content = document.getElementById("content");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");
const modalClose = document.getElementById("modal-close");
const playerBar = document.getElementById("player-bar");
const playerTitle = document.getElementById("player-title");
const playerPlay = document.getElementById("player-play");
const playerStop = document.getElementById("player-stop");

let currentAudio = null;
let currentSong = null;
let currentPlayBtn = null;
let lineup = JSON.parse(localStorage.getItem("lineup")) || [];
let currentTab = "lineup";

// 🎵 Demo data
const musicData = {
  entrance: [
    { title: "Welcome Song", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Opening Tune", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  ],

  // Sustain section with pads
  sustain: [
    { label: "A", color: "#00bfff", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { label: "B", color: "#ff69b4", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { label: "C", color: "#32cd32", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { label: "D", color: "#ffa500", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { label: "E", color: "#9370db", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { label: "F", color: "#ff4500", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  ],

  preach: [
    { title: "Grace Theme", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "Faith Message", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  ],
  testimony: [
    { title: "Witness Jam", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { title: "Praise Beat", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  ],
  victory: [
    { title: "Champion Anthem", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { title: "Final Glory", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
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
  currentSong = null;
  currentPlayBtn = null;
}

// === Load tab content ===
function loadTab(tab) {
  currentTab = tab;
  content.innerHTML = "";

  const list = tab === "lineup" ? lineup : musicData[tab];

  // Handle Sustain tab separately
  if (tab === "sustain") {
    if (!list || list.length === 0) {
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
          showModal(`❌ Removed "${pad.label}" from Line Up`);
        } else {
          lineup.push({ title: pad.label, file: pad.file });
          starBtn.textContent = "⭐";
          showModal(`⭐ Added "${pad.label}" to Line Up`);
        }
        saveLineup();
        renderLineupSidebar();
      });

      grid.appendChild(padDiv);
    });

    content.appendChild(grid);
    return;
  }

  if (!list || list.length === 0) {
    content.innerHTML = "<p style='text-align:center;opacity:0.7;'>No songs here yet 🎵</p>";
    return;
  }

  list.forEach(song => {
    const div = document.createElement("div");
    const isBookmarked = lineup.find(s => s.title === song.title);
    div.className = "song";
    div.innerHTML = `
      <span class="song-title">${song.title}</span>
      <div>
        <button class="play">▶</button>
        <button class="bookmark">${isBookmarked ? "⭐" : "☆"}</button>
      </div>
    `;

    const playBtn = div.querySelector(".play");
    const bookmarkBtn = div.querySelector(".bookmark");
    const audio = new Audio(song.file);

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
      const index = lineup.findIndex(s => s.title === song.title);
      if (index === -1) {
        lineup.push(song);
        bookmarkBtn.textContent = "⭐";
        showModal(`⭐ Added "${song.title}" to Line Up`);
      } else {
        lineup.splice(index, 1);
        bookmarkBtn.textContent = "☆";
        showModal(`❌ Removed "${song.title}" from Line Up`);
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

mobileNavTrigger.addEventListener("click", () => {
  mobileNavMenu.classList.toggle("hidden");
  arrow.classList.toggle("rotated");
});

document.querySelectorAll(".mobile-nav-item").forEach(item => {
  item.addEventListener("click", () => {
    const tabName = item.dataset.tab;
    handleTabSwitch(tabName);
    mobileNavLabel.textContent = item.textContent;
    mobileNavMenu.classList.add("hidden");
    arrow.classList.remove("rotated");
  });
});

function handleTabSwitch(tabName) {
  tabs.forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  if (btn) btn.classList.add("active");
  loadTab(tabName);
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

// 🧩 Render lineup (bookmarked songs) in sidebar
function renderLineupSidebar() {
  lineupContent.innerHTML = "";

  if (!lineup.length) {
    lineupContent.innerHTML = `<p style="text-align:center;opacity:0.7;">No lineup yet 🎵</p>`;
    return;
  }

  lineup.forEach(song => {
    const div = document.createElement("div");
    div.className = "song";
    div.innerHTML = `
      <span class="song-title">${song.title}</span>
      <div>
        <button class="play">▶</button>
        <button class="remove">❌</button>
      </div>
    `;

    const playBtn = div.querySelector(".play");
    const removeBtn = div.querySelector(".remove");
    const audio = new Audio(song.file);

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

    removeBtn.addEventListener("click", () => {
      lineup = lineup.filter(s => s.title !== song.title);
      saveLineup();
      showModal(`❌ Removed "${song.title}" from Line Up`);
      renderLineupSidebar();
      updateAllTabs();
    });

    lineupContent.appendChild(div);
  });
}

// Keep sidebar synced
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

// Update on load and resize
window.addEventListener("resize", syncMobileNavWidth);
window.addEventListener("load", syncMobileNavWidth);
