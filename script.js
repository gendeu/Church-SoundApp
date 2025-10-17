document.addEventListener("DOMContentLoaded", () => {
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

  const sidebar = document.getElementById("left-panel");
  const toggleSidebar = document.getElementById("toggle-sidebar");
  const lineupContent = document.getElementById("lineup-content");
  const showSidebarBtn = document.getElementById("show-sidebar");

  let currentAudio = null;
  let currentSong = null;
  let currentPlayBtn = null;
  let lineup = JSON.parse(localStorage.getItem("lineup")) || [];
  let currentTab = "intro";
  let lastPlaying = { title: null, tab: null };
  let isEditingLineup = false;


  // === Music Data ===
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
      { title: "Too much thinking", file: "media/effects/Too much thinking.mp3" },
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

  // === Modal ===
  function showModal(message) {
    modalText.textContent = message;
    modal.classList.remove("hidden");
  }
  modalClose.addEventListener("click", () => modal.classList.add("hidden"));

  // === Save lineup ===
  function saveLineup() {
    localStorage.setItem("lineup", JSON.stringify(lineup));
  }

  // === Player Bar ===
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

    // Play / Pause toggle
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

    // Stop button
    playerStop.onclick = () => stopCurrentAudio(true);

    // 🔄 Progress & duration update
    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
      progressTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });

    // 🔘 Seek manually
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

  // === Load Tab ===
  function loadTab(tab) {
    currentTab = tab;
    content.innerHTML = "";
    const searchContainer = document.getElementById("search-container");
    const searchInput = document.getElementById("search-input");

    // Show search only for specific tabs
    if (["intro", "emotion", "songs"].includes(tab)) {
      searchContainer.classList.remove("hidden");
      searchInput.value = "";
    } else {
      searchContainer.classList.add("hidden");
    }

    // 🔍 Search filter logic
    searchInput.oninput = () => {
      const query = searchInput.value.toLowerCase();
      const list = tab === "lineup" ? lineup : musicData[tab];
      const filtered = list.filter(item => item.title.toLowerCase().includes(query));
      renderFilteredList(tab, filtered);
    };

    // helper: re-render filtered items only
    function renderFilteredList(tab, filteredList) {
      content.innerHTML = "";
      filteredList.forEach(song => {
        const div = document.createElement("div");
        const isBookmarked = lineup.find(s => s.title === song.title);
        div.className = "song";
        div.innerHTML = `
          <span class="song-title">${song.title}</span>
          <div><button class="play">▶</button><button class="bookmark">${isBookmarked ? "⭐" : "☆"}</button></div>
        `;
        const playBtn = div.querySelector(".play");
        const bookmarkBtn = div.querySelector(".bookmark");
        const audio = new Audio(song.file);
        audio.loop = true;

        playBtn.addEventListener("click", () => {
          if (currentAudio && currentAudio !== audio) stopCurrentAudio();
          if (currentAudio === audio && !audio.paused) {
            stopCurrentAudio(true);
          } else {
            document.querySelectorAll(".song").forEach(s => s.classList.remove("playing"));
            audio.play();
            div.classList.add("playing");
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
        });

        content.appendChild(div);
      });
    }

    const addMusicBtn = document.getElementById("add-music-btn");

    if (addMusicBtn) {
      addMusicBtn.addEventListener("click", async () => {
        // Works for Electron desktop version
        if (window.electronAPI?.openFileDialog) {
          const paths = await window.electronAPI.openFileDialog([{ name: "Music Files", extensions: ["mp3"] }]);
          if (!paths || !paths.length) return;

          // Add selected files to current tab (if applicable)
          const tab = currentTab;
          if (!["intro", "emotion", "songs"].includes(tab)) {
            showModal("⚠️ Adding music is only supported in Intro, Emotion, or Songs tabs.");
            return;
          }

          paths.forEach(filePath => {
            const fileName = filePath.split(/[\\/]/).pop().replace(/\.[^/.]+$/, "");
            musicData[tab].push({ title: fileName, file: filePath });
          });

          showModal(`🎵 Added ${paths.length} new track(s)!`);
          loadTab(tab);
        } else {
          showModal("⚠️ Music upload is available only in the desktop app.");
        }
      });
    }


    const list = tab === "lineup" ? lineup : musicData[tab];
    if (!list || !list.length) {
      content.innerHTML = "<p style='text-align:center;opacity:0.7;'>No items yet 🎵</p>";
      return;
    }

        // === Sustain Pads ===
    if (tab === "pads") {
      const grid = document.createElement("div");
      grid.className = "sustain-grid";
      const padColors = ["#00bfff", "#ff6600", "#ff33cc", "#33ff99", "#ffff33", "#ff3333", "#33ccff"];

      list.forEach(pad => {
        const padDiv = document.createElement("div");
        padDiv.className = "pad";
        const color = padColors[Math.floor(Math.random() * padColors.length)];
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

        grid.appendChild(padDiv);
      });
      content.appendChild(grid);
      return;
    }

    // inside loadTab(tab)
    if (tab === "effects") {
      const grid = document.createElement("div");
      grid.className = "effects-grid";

      const effectColors = ["#00bfff", "#ff6600", "#ff33cc", "#33ff99", "#ffff33", "#ff3333", "#33ccff"];

      list.forEach(effect => {
        const effectDiv = document.createElement("div");
        effectDiv.className = "effect";
        const color = effectColors[Math.floor(Math.random() * effectColors.length)];
        effectDiv.style.setProperty("--effect-color", color);
        effectDiv.innerHTML = `
          <span class="effect-label">${effect.title}</span>
          <button class="effect-star">${lineup.find(s => s.title === effect.title) ? "⭐" : "☆"}</button>
        `;

        const audio = new Audio(effect.file);
        audio.loop = true;
        const starBtn = effectDiv.querySelector(".effect-star");

        effectDiv.addEventListener("click", () => {
          if (currentAudio && currentAudio !== audio) stopCurrentAudio();
          if (currentAudio === audio && !audio.paused) {
            stopCurrentAudio(true);
            effectDiv.classList.remove("active");
          } else {
            document.querySelectorAll(".effect").forEach(e => e.classList.remove("active"));
            audio.play();
            effectDiv.classList.add("active");
            updatePlayerBar({ title: effect.title, file: effect.file }, audio);

            // 🔄 sync glow with lineup
            document.querySelectorAll(".song").forEach(s => {
              const t = s.querySelector(".song-title")?.textContent.replace(/[🎹🔊]\s*/, "").trim();
              if (t === effect.title) s.classList.add("playing");
            });
          }
        });

        starBtn.addEventListener("click", e => {
          e.stopPropagation();
          const exists = lineup.find(s => s.title === effect.title);
          if (exists) {
            lineup = lineup.filter(s => s.title !== effect.title);
            starBtn.textContent = "☆";
            showModal(`❌ Removed "${effect.title}"`);
          } else {
            lineup.push({ title: effect.title, file: effect.file, type: "effect" });
            starBtn.textContent = "⭐";
            showModal(`⭐ Added "${effect.title}"`);
          }
          saveLineup();
          renderLineupSidebar();
        });

        grid.appendChild(effectDiv);
      });

      content.appendChild(grid);
      return;
    }

    // === Songs ===
    list.forEach(song => {
      const div = document.createElement("div");
      const isBookmarked = lineup.find(s => s.title === song.title);
      div.className = "song";
      div.innerHTML = `
        <span class="song-title">${song.title}</span>
        <div><button class="play">▶</button><button class="bookmark">${isBookmarked ? "⭐" : "☆"}</button></div>
      `;
      const playBtn = div.querySelector(".play");
      const bookmarkBtn = div.querySelector(".bookmark");
      const audio = new Audio(song.file);
      audio.loop = true;

      playBtn.addEventListener("click", () => {
        if (currentAudio && currentAudio !== audio) stopCurrentAudio();
        if (currentAudio === audio && !audio.paused) {
          stopCurrentAudio(true);
        } else {
          document.querySelectorAll(".song").forEach(s => s.classList.remove("playing"));
          audio.play();
          div.classList.add("playing");
          updatePlayerBar(song, audio, playBtn);

          // 🔄 glow both tab + lineup
          document.querySelectorAll(".song").forEach(s => {
            const t = s.querySelector(".song-title")?.textContent.trim();
            if (t === song.title) s.classList.add("playing");
          });
        }
      });

      bookmarkBtn.addEventListener("click", () => {
        const i = lineup.findIndex(s => s.title === song.title);
        if (i === -1) {
          lineup.push(song);
          bookmarkBtn.textContent = "⭐";
          showModal(`⭐ Added "${song.title}" to LineUp List`);
        } else {
          lineup.splice(i, 1);
          bookmarkBtn.textContent = "☆";
          showModal(`❌ Removed "${song.title}"`);
        }
        saveLineup();
        renderLineupSidebar();
      });

      content.appendChild(div);
    });
  }

  // === Sidebar ===
  toggleSidebar.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    sidebar.classList.toggle("expanded");
    const isCollapsed = sidebar.classList.contains("collapsed");
    toggleSidebar.textContent = isCollapsed ? "⏵" : "⏴";
    showSidebarBtn.classList.toggle("hidden", !isCollapsed);
  });

  showSidebarBtn.addEventListener("click", () => {
    sidebar.classList.remove("collapsed");
    sidebar.classList.add("expanded");
    showSidebarBtn.classList.add("hidden");
    toggleSidebar.textContent = "⏴";
  });

  function renderLineupSidebar() {
    lineupContent.innerHTML = "";
    if (!lineup.length) {
      lineupContent.innerHTML = `<p style="text-align:center;opacity:0.7;">No lineup yet 🎵</p>`;
      return;
    }

    lineup.forEach((song, index) => {
      const div = document.createElement("div");
      div.className = "song";
      div.draggable = true; // Enable drag
      div.dataset.index = index;

      // 🎵 Show icon depending on type
      const icon = song.type === "pad" ? "🎹" : "🔊";

      div.innerHTML = `
        <span class="song-title">${icon} ${song.title}</span>
        <div class="song-controls">
          <button class="play">▶</button>
          <button class="remove hidden">❌</button>
          <span class="drag-handle hidden">⠿</span>
        </div>
      `;

      // ✅ Keep edit mode visible after re-render (with small delay for DOM stability)
      if (isEditingLineup) {
        requestAnimationFrame(() => {
          const controls = document.querySelectorAll(".remove, .drag-handle");
          controls.forEach(el => el.classList.remove("hidden"));
          const editBtn = document.getElementById("edit-lineup-toggle");
          if (editBtn) editBtn.textContent = "✅";
        });
      }


      const playBtn = div.querySelector(".play");
      const removeBtn = div.querySelector(".remove");
      const audio = new Audio(song.file);
      audio.loop = true;

      // ▶️ Play / Pause
      playBtn.addEventListener("click", () => {
        if (currentAudio && currentAudio !== audio) stopCurrentAudio();
        if (currentAudio === audio && !audio.paused) {
          stopCurrentAudio(true);
        } else {
          document.querySelectorAll(".song").forEach(s => s.classList.remove("playing"));
          audio.play();
          div.classList.add("playing");
          updatePlayerBar(song, audio, playBtn);

          // Sync glow between tabs, pads, and lineup
          document.querySelectorAll(".song, .pad").forEach(s => {
            const t = s.querySelector(".song-title, .pad-label")?.textContent.replace(/^[🎹🔊]\s*/, "").trim();
            if (t === song.title) s.classList.add("playing", "active");
          });
        }
      });

      // ❌ Remove
      removeBtn.addEventListener("click", () => {
        lineup = lineup.filter(s => s.title !== song.title);
        saveLineup();
        showModal(`❌ Removed "${song.title}"`);

        // 🔄 Unmark in all sections: songs, pads, and effects
        document.querySelectorAll(".bookmark, .pad-star, .effect-star").forEach(btn => {
          const title =
            btn.closest(".song")?.querySelector(".song-title")?.textContent.trim() ||
            btn.closest(".pad")?.querySelector(".pad-label")?.textContent.trim() ||
            btn.closest(".effect-item")?.querySelector(".effect-label")?.textContent.trim();
          if (title === song.title) btn.textContent = "☆";
        });

        // 🔄 Remove glow/active class across all matching elements
        document.querySelectorAll(".song, .pad, .effect-item").forEach(el => {
          const label =
            el.querySelector(".song-title, .pad-label, .effect-label")?.textContent
              ?.replace(/^[🎹🔊]\s*/, "")
              .trim();
          if (label === song.title) el.classList.remove("playing", "active");
        });

        renderLineupSidebar();
      });

      lineupContent.appendChild(div);
    });

    // 🧲 Drag & drop reordering
    const draggables = lineupContent.querySelectorAll(".song");
    let draggedItem = null;

    draggables.forEach(item => {
      item.addEventListener("dragstart", () => {
        draggedItem = item;
        item.classList.add("dragging");
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        draggedItem = null;

        // Save new order
        const newOrder = Array.from(lineupContent.children).map(el => {
          const index = parseInt(el.dataset.index);
          return lineup[index];
        });
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

    // 📱 Touch drag support for mobile (stable version)
    let touchTimer = null;
    let touchDragged = null;
    let touchStartY = 0;

    lineupContent.querySelectorAll(".song").forEach(item => {
      item.addEventListener("touchstart", e => {
        if (!isEditingLineup) return;
        touchStartY = e.touches[0].clientY;

        // ⏱ long-press to activate drag
        touchTimer = setTimeout(() => {
          touchDragged = item;
          item.classList.add("dragging");
          document.body.style.userSelect = "none"; // prevent highlighting
        }, 250);
      }, { passive: true });

      item.addEventListener("touchmove", e => {
        if (!touchDragged) return;
        e.preventDefault();
        const currentY = e.touches[0].clientY;

        const siblings = Array.from(lineupContent.children).filter(s => s !== touchDragged);
        let target = null;
        for (const s of siblings) {
          const rect = s.getBoundingClientRect();
          if (currentY > rect.top && currentY < rect.bottom) {
            target = s;
            break;
          }
        }

        if (target) {
          const rect = target.getBoundingClientRect();
          const after = (currentY - rect.top) > rect.height / 2;
          lineupContent.insertBefore(touchDragged, after ? target.nextSibling : target);
        }
        touchStartY = currentY;
      }, { passive: false });

      const finishTouch = () => {
        clearTimeout(touchTimer);
        document.body.style.userSelect = "";
        touchTimer = null;

        if (!touchDragged) return;
        touchDragged.classList.remove("dragging");

        // ✅ Build new lineup order safely by matching DOM to lineup
        const newOrder = Array.from(lineupContent.children).map(el => {
          const title = el.querySelector(".song-title")?.textContent.replace(/^[🎹🔊]\s*/, "").trim();
          return lineup.find(song => song.title === title);
        }).filter(Boolean);

        if (newOrder.length === lineup.length) {
          lineup = newOrder;
          saveLineup();
        }

        // 🔁 Re-render after short delay to ensure stable DOM
        setTimeout(renderLineupSidebar, 150);
        touchDragged = null;
      };

      item.addEventListener("touchend", finishTouch);
      item.addEventListener("touchcancel", finishTouch);
    });
    
    const editBtn = document.getElementById("edit-lineup-toggle");
    if (editBtn) {
      editBtn.onclick = () => {
        isEditingLineup = !isEditingLineup;
        editBtn.textContent = isEditingLineup ? "✅" : "✏️";
        document.querySelectorAll(".remove, .drag-handle").forEach(el => {
          el.classList.toggle("hidden", !isEditingLineup);
        });
      };
    }


  }

  // === Tabs ===
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadTab(btn.dataset.tab);
    });
  });

  renderLineupSidebar();
  loadTab("intro");

  // === Mobile navigation ===
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
});

// === Keep mobile nav menu same width as trigger ===
function syncMobileNavWidth() {
  const trigger = document.getElementById("mobile-nav-trigger");
  const menu = document.getElementById("mobile-nav-menu");
  if (!trigger || !menu) return;

  // Temporarily show the menu if hidden (so we can measure)
  const wasHidden = menu.classList.contains("hidden");
  if (wasHidden) menu.classList.remove("hidden");

  // Match the trigger width exactly, accounting for padding & borders
  const triggerRect = trigger.getBoundingClientRect();
  menu.style.width = `${triggerRect.width}px`;
  menu.style.minWidth = `${triggerRect.width}px`;

  // Re-hide it if it was hidden before
  if (wasHidden) menu.classList.add("hidden");
}

// Run once and on resize/orientation change
window.addEventListener("load", syncMobileNavWidth);
window.addEventListener("resize", syncMobileNavWidth);
window.addEventListener("orientationchange", syncMobileNavWidth);
