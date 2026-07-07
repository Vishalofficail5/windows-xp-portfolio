(function () {
    const SONGS = {
        english: [
            { title: "2002", file: "2002_spotdown.org.mp3" },
            { title: "Astronaut In The Ocean", file: "Astronaut In The Ocean_spotdown.org.mp3" },
            { title: "Be Kind (with Halsey)", file: "Be Kind (with Halsey)_spotdown.org.mp3" },
            { title: "Beautiful (feat. Camila Cabello)", file: "Beautiful (feat. Camila Cabello)_spotdown.org.mp3" },
            { title: "Believer", file: "Believer_spotdown.org.mp3" },
            { title: "Blinding Lights", file: "Blinding Lights_spotdown.org.mp3" },
            { title: "Break My Heart", file: "Break My Heart_spotdown.org.mp3" },
            { title: "Can We Kiss Forever?", file: "Can We Kiss Forever__spotdown.org.mp3" },
            { title: "Cheap Thrills (feat. Sean Paul)", file: "Cheap Thrills (feat. Sean Paul)_spotdown.org.mp3" },
            { title: "Despacito - Remix", file: "Despacito - Remix_spotdown.org.mp3" },
            { title: "Don't Start Now", file: "Don't Start Now_spotdown.org.mp3" },
            { title: "Faded", file: "Faded_spotdown.org.mp3" },
            { title: "Falling", file: "Falling_spotdown.org.mp3" },
            { title: "I Like Him", file: "I Like Him_spotdown.org.mp3" },
            { title: "I'm a Mess", file: "I'm a Mess_spotdown.org.mp3" },
            { title: "Kings & Queens", file: "Kings & Queens_spotdown.org.mp3" },
            { title: "Kiss Me More (feat. SZA)", file: "Kiss Me More (feat. SZA)_spotdown.org.mp3" },
            { title: "Let Me Down Slowly", file: "Let Me Down Slowly_spotdown.org.mp3" },
            { title: "Levitating (feat. DaBaby)", file: "Levitating (feat. DaBaby)_spotdown.org.mp3" },
            { title: "Liar", file: "Liar_spotdown.org.mp3" },
            { title: "MONTERO (Call Me By Your Name)", file: "MONTERO (Call Me By Your Name)_spotdown.org.mp3" },
            { title: "Meant to Be (feat. Florida Georgia Line)", file: "Meant to Be (feat. Florida Georgia Line)_spotdown.org.mp3" },
            { title: "Memories", file: "Memories_spotdown.org.mp3" },
            { title: "Mood (feat. iann dior)", file: "Mood (feat. iann dior)_spotdown.org.mp3" },
            { title: "New Rules", file: "New Rules_spotdown.org.mp3" },
            { title: "None Of My Business", file: "None Of My Business_spotdown.org.mp3" },
            { title: "Shape of You", file: "Shape of You_spotdown.org.mp3" },
            { title: "The Middle", file: "The Middle_spotdown.org.mp3" },
            { title: "There's Nothing Holdin' Me Back", file: "There's Nothing Holdin' Me Back_spotdown.org.mp3" },
            { title: "lovely (with Khalid)", file: "lovely (with Khalid)_spotdown.org.mp3" }
        ],
        hindi: [
            { title: "Adore", file: "Adore_spotdown.org.mp3" },
            { title: "Afterhours", file: "Afterhours_spotdown.org.mp3" },
            { title: "Asi Gabru Punjabi", file: "Asi Gabru Punjabi_spotdown.org.mp3" },
            { title: "C.R.E.A.M POSSE", file: "C.R.E.A.M POSSE_spotdown.org.mp3" },
            { title: "CEO", file: "CEO_spotdown.org.mp3" },
            { title: "Daytona", file: "Daytona_spotdown.org.mp3" },
            { title: "Death Route", file: "Death Route_spotdown.org.mp3" },
            { title: "Dhundhala", file: "Dhundhala_spotdown.org.mp3" },
            { title: "Excuses", file: "Excuses_spotdown.org.mp3" },
            { title: "Her", file: "Her_spotdown.org.mp3" },
            { title: "Hood Famous", file: "Hood Famous_spotdown.org.mp3" },
            { title: "Insane", file: "Insane_spotdown.org.mp3" },
            { title: "Kamlee", file: "Kamlee_spotdown.org.mp3" },
            { title: "Kath Lagda", file: "Kath Lagda_spotdown.org.mp3" },
            { title: "Ki Samjiye", file: "Ki Samjiye_spotdown.org.mp3" },
            { title: "King Shit", file: "King Shit_spotdown.org.mp3" },
            { title: "Love Exit", file: "Love Exit_spotdown.org.mp3" },
            { title: "Mera Mann", file: "Mera Mann_spotdown.org.mp3" },
            { title: "My Prime", file: "My Prime_spotdown.org.mp3" },
            { title: "Naam Chale", file: "Naam Chale_spotdown.org.mp3" },
            { title: "Nakhre", file: "Nakhre_spotdown.org.mp3" },
            { title: "Navior", file: "Navior_spotdown.org.mp3" },
            { title: "One Question", file: "One Question_spotdown.org.mp3" },
            { title: "SHKINI", file: "SHKINI_spotdown.org.mp3" },
            { title: "SPACESHIP", file: "SPACESHIP_spotdown.org.mp3" },
            { title: "Saada Pyaar", file: "Saada Pyaar_spotdown.org.mp3" },
            { title: "Same Beef", file: "Same Beef_spotdown.org.mp3" },
            { title: "Sangdi", file: "Sangdi_spotdown.org.mp3" },
            { title: "Showstopper", file: "Showstopper_spotdown.org.mp3" },
            { title: "Sweet Talk", file: "Sweet Talk_spotdown.org.mp3" },
            { title: "TERE BINA", file: "TERE BINA_spotdown.org.mp3" },
            { title: "Tension", file: "Tension_spotdown.org.mp3" },
            { title: "These Days (feat. Bohemia)", file: "These Days (feat. Bohemia)_spotdown.org.mp3" },
            { title: "This Party Getting Hot", file: "This Party Getting Hot_spotdown.org.mp3" },
            { title: "Top Flame", file: "Top Flame_spotdown.org.mp3" },
            { title: "True Stories", file: "True Stories_spotdown.org.mp3" },
            { title: "Untouchable", file: "Untouchable_spotdown.org.mp3" },
            { title: "VOGUE", file: "VOGUE_spotdown.org.mp3" },
            { title: "WANG", file: "WANG_spotdown.org.mp3" },
            { title: "Wakhra Swag", file: "Wakhra Swag_spotdown.org.mp3" },
            { title: "Water", file: "Water_spotdown.org.mp3" },
            { title: "What We Do", file: "What We Do_spotdown.org.mp3" },
            { title: "With You", file: "With You_spotdown.org.mp3" }
        ]
    };

    const SONG_DIR = {
        english: "assets/Song/English/",
        hindi: "assets/Song/Hindi/"
    };

    const DEFAULT_ART = "assets/icons/dics1.png";
    const FALLBACK_ART = "assets/icons/Song.png";

    const VOLUME_ICON_ON = "assets/icons/volume-on.png";
    const VOLUME_ICON_OFF = "assets/icons/volume-off.png";

    let lang = null;
    let queue = [];
    let currentIndex = 0;
    let shuffleOn = false;
    let repeatOn = false;
    let muted = false;
    let favorites = new Set();


    const win = document.getElementById("songWindow");
    const langView = document.getElementById("songLangView");
    const playerView = document.getElementById("songPlayerView");

    const hindiBtn = document.getElementById("langHindiBtn");
    const englishBtn = document.getElementById("langEnglishBtn");
    const changeLangBtn = document.getElementById("changeLangBtn");

    const audio = document.getElementById("songAudio");
    const albumArtImg = document.getElementById("albumArtImg");
    const songEq = document.getElementById("songEq");
    const trackTitle = document.getElementById("trackTitle");
    const trackMeta = document.getElementById("trackMeta");
    const seek = document.getElementById("songSeek");
    const curTimeEl = document.getElementById("songCurTime");
    const durTimeEl = document.getElementById("songDurTime");

    const shuffleBtn = document.getElementById("shuffleBtn");
    const prevBtn = document.getElementById("prevBtn");
    const playBtn = document.getElementById("playBtn");
    const nextBtn = document.getElementById("nextBtn");
    const repeatBtn = document.getElementById("repeatBtn");
    const heartBtn = document.getElementById("heartBtn");
    const muteBtn = document.getElementById("muteBtn");
    const muteIcon = document.getElementById("muteIcon");
    const volumeSlider = document.getElementById("songVolume");
    const queueBtn = document.getElementById("queueBtn");
    const queuePanel = document.getElementById("songQueuePanel");
    const queueList = document.getElementById("songQueueList");
    const songCloseBtn = win.querySelector(".closeBtn");
    const songMinimizeBtn = win.querySelector(".minimizeBtn");

    function formatTime(sec) {
        if (!isFinite(sec) || sec < 0) sec = 0;
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }


    const EQ_BAR_COUNT = 22;
    for (let i = 0; i < EQ_BAR_COUNT; i++) {
        const bar = document.createElement("span");
        const duration = (0.5 + Math.random() * 0.6).toFixed(2);
        const delay = (-Math.random() * 1).toFixed(2);
        bar.style.animationDuration = duration + "s";
        bar.style.animationDelay = delay + "s";
        songEq.appendChild(bar);
    }

    const songArt = songEq.parentElement;
    const notesLayer = document.createElement("div");
    notesLayer.className = "song-notes-layer";
    songArt.appendChild(notesLayer);

    const NOTE_CHARS = ["♪", "♫", "♬", "♩"];
    let noteTimer = null;

    function spawnNote() {
        const note = document.createElement("span");
        note.className = "song-note";
        note.textContent = NOTE_CHARS[Math.floor(Math.random() * NOTE_CHARS.length)];

        const startX = (10 + Math.random() * 78).toFixed(1) + "%";
        const drift = (Math.random() * 70 - 35).toFixed(0) + "px";
        const spin = (Math.random() * 70 - 35).toFixed(0) + "deg";
        const duration = (2.4 + Math.random() * 1.8).toFixed(2) + "s";
        const size = (16 + Math.random() * 14).toFixed(0) + "px";
        const hue = Math.floor(Math.random() * 360);

        note.style.left = startX;
        note.style.fontSize = size;
        note.style.color = `hsl(${hue}, 90%, 60%)`;
        note.style.textShadow = `0 0 6px hsl(${hue}, 100%, 70%), 0 0 2px rgba(0,0,0,.4)`;
        note.style.setProperty("--drift", drift);
        note.style.setProperty("--spin", spin);
        note.style.animationDuration = duration;

        notesLayer.appendChild(note);
        note.addEventListener("animationend", () => note.remove(), { once: true });
    }

    function startNoteSpawner() {
        stopNoteSpawner();
        spawnNote();
        noteTimer = setInterval(() => {
            spawnNote();
            if (Math.random() < 0.5) {
                setTimeout(spawnNote, 200 + Math.random() * 350);
            }
        }, 650 + Math.random() * 550); 
    }

    function stopNoteSpawner() {
        if (noteTimer) {
            clearInterval(noteTimer);
            noteTimer = null;
        }
    }

    function clearNotes() {
        notesLayer.innerHTML = "";
    }

    function setEqPlaying(isPlaying) {
        songEq.classList.toggle("playing", isPlaying);
        songArt.classList.toggle("playing", isPlaying);
        if (isPlaying) {
            startNoteSpawner();
        } else {
            stopNoteSpawner();
        }
    }

    function encodePath(dir, file) {
        return dir.split("/").map(encodeURIComponent).join("/") + encodeURIComponent(file);
    }

    function renderQueueList() {
        queueList.innerHTML = "";
        queue.forEach((song, i) => {
            const row = document.createElement("div");
            row.className = "song-queue-row" + (i === currentIndex ? " active" : "");
            const fav = favorites.has(song.file) ? "♥ " : "";
            row.textContent = `${i + 1}. ${fav}${song.title}`;
            row.addEventListener("click", () => loadTrack(i, true));
            queueList.appendChild(row);
        });
    }

    function updateHeart() {
        const song = queue[currentIndex];
        heartBtn.classList.toggle("active", song && favorites.has(song.file));
    }

    function loadTrack(index, autoplay) {
        if (!queue.length) return;
        currentIndex = (index + queue.length) % queue.length;
        const song = queue[currentIndex];
        audio.src = encodePath(SONG_DIR[lang], song.file);
        albumArtImg.onerror = () => {
            if (albumArtImg.src.indexOf(FALLBACK_ART) === -1) {
                albumArtImg.onerror = () => { albumArtImg.onerror = null; };
                albumArtImg.src = FALLBACK_ART;
            }
        };
        albumArtImg.src = song.art || DEFAULT_ART;
        trackTitle.textContent = song.title;
        trackMeta.textContent = `Track ${currentIndex + 1} of ${queue.length} — ${lang === "hindi" ? "Hindi" : "English"}`;
        updateHeart();
        renderQueueList();
        if (autoplay) {
            attemptPlay();
        }
        setPlayIcon();
    }

    function attemptPlay() {
        audio.play().catch((err) => {
            console.error("Lotify playback error:", err, "src:", audio.src);
            trackMeta.textContent = "Couldn't play this track (" + err.name + "). Check the file path/name and the browser console.";
            setPlayIcon();
        });
    }

    function setPlayIcon() {
        playBtn.textContent = audio.paused ? "▶" : "❚❚";
    }

    function togglePlay() {
        if (!queue.length) return;
        if (audio.paused) {
            attemptPlay();
        } else {
            audio.pause();
        }
        setPlayIcon();
    }

    function nextTrack() {
        if (!queue.length) return;
        if (shuffleOn) {
            let next;
            do {
                next = Math.floor(Math.random() * queue.length);
            } while (queue.length > 1 && next === currentIndex);
            loadTrack(next, true);
        } else {
            loadTrack(currentIndex + 1, true);
        }
    }

    function prevTrack() {
        if (!queue.length) return;
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        loadTrack(currentIndex - 1, true);
    }

    function startLanguage(chosen) {
        lang = chosen;
        queue = SONGS[chosen].slice();
        currentIndex = 0;
        langView.style.display = "none";
        playerView.style.display = "flex";
        loadTrack(0, false);
    }

    function backToLanguage() {
        audio.pause();
        audio.removeAttribute("src");
        queuePanel.style.display = "none";
        playerView.style.display = "none";
        langView.style.display = "flex";
        stopNoteSpawner();
        clearNotes();
        songArt.classList.remove("playing");
    }

    hindiBtn.addEventListener("click", () => startLanguage("hindi"));
    englishBtn.addEventListener("click", () => startLanguage("english"));
    changeLangBtn.addEventListener("click", backToLanguage);

    playBtn.addEventListener("click", togglePlay);
    nextBtn.addEventListener("click", nextTrack);
    prevBtn.addEventListener("click", prevTrack);

    shuffleBtn.addEventListener("click", () => {
        shuffleOn = !shuffleOn;
        shuffleBtn.classList.toggle("active", shuffleOn);
    });

    repeatBtn.addEventListener("click", () => {
        repeatOn = !repeatOn;
        repeatBtn.classList.toggle("active", repeatOn);
    });

    heartBtn.addEventListener("click", () => {
        const song = queue[currentIndex];
        if (!song) return;
        if (favorites.has(song.file)) {
            favorites.delete(song.file);
        } else {
            favorites.add(song.file);
        }
        updateHeart();
        renderQueueList();
    });

    muteIcon.onerror = () => {
        muteIcon.onerror = null;
        muteIcon.style.display = "none";
        muteBtn.textContent = muted ? "\u{1F507}" : "\u{1F50A}";
    };

    muteBtn.addEventListener("click", () => {
        muted = !muted;
        audio.muted = muted;
        muteBtn.classList.toggle("active", muted);
        if (muteIcon.style.display === "none") {
            muteBtn.textContent = muted ? "\u{1F507}" : "\u{1F50A}";
        } else {
            muteIcon.src = muted ? VOLUME_ICON_OFF : VOLUME_ICON_ON;
        }
    });

    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value / 100;
        if (muted && volumeSlider.value > 0) {
            muted = false;
            audio.muted = false;
            muteBtn.classList.remove("active");
            if (muteIcon.style.display === "none") {
                muteBtn.textContent = "\u{1F50A}";
            } else {
                muteIcon.src = VOLUME_ICON_ON;
            }
        }
    });

    audio.volume = volumeSlider.value / 100;

    if (songCloseBtn) {
        songCloseBtn.addEventListener("click", () => {
            backToLanguage();
        });
    }

    queueBtn.addEventListener("click", () => {
        const showing = queuePanel.style.display === "block";
        queuePanel.style.display = showing ? "none" : "block";
    });

    seek.addEventListener("input", () => {
        if (audio.duration) {
            audio.currentTime = (seek.value / 100) * audio.duration;
        }
    });

    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            seek.value = (audio.currentTime / audio.duration) * 100;
            curTimeEl.textContent = formatTime(audio.currentTime);
        }
    });
    audio.addEventListener("loadedmetadata", () => {
        durTimeEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener("play", () => {
        setPlayIcon();
        setEqPlaying(true);
    });
    audio.addEventListener("pause", () => {
        setPlayIcon();
        setEqPlaying(false);
    });
    audio.addEventListener("ended", () => {
        if (repeatOn) {
            audio.currentTime = 0;
            audio.play().catch(() => { });
        } else {
            nextTrack();
        }
    });
    audio.addEventListener("error", () => {
        trackMeta.textContent = "Couldn't load this track — check that the file exists in assets/Song/.";
    });
    window.stopLotify = function () {
        backToLanguage();
    };
    window.resetLotifyIfClosed = function () {
        if (win.style.display === "none") {
            audio.pause();
        }
    };
})();