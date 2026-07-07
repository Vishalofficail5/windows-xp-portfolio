// Home
const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
    document.querySelectorAll(".window").forEach(win => {
        win.style.display = "none";
        removeTaskbarButton(win);
    });

    if (typeof window.stopLotify === "function") {
        window.stopLotify();
    }

    if (typeof window.stopArcadeGame === "function") {
        window.stopArcadeGame();
    }
});

// About
const aboutBtn = document.getElementById("aboutBtn");
const aboutWindow = document.getElementById("aboutWindow");
aboutBtn.addEventListener("click", () => openWindow(aboutWindow));

// Projects
const projectsBtn = document.getElementById("projectBtn");
const projectsWindow = document.getElementById("projectsWindow");
projectsBtn.addEventListener("click", () => openWindow(projectsWindow));

// Experience
const experienceBtn = document.getElementById("experienceBtn");
const experienceWindow = document.getElementById("experienceWindow");
experienceBtn.addEventListener("click", () => openWindow(experienceWindow));

// Contact
const contactBtn = document.getElementById("contactBtn");
const contactWindow = document.getElementById("contactWindow");
contactBtn.addEventListener("click", () => openWindow(contactWindow));

// Lotify (Song)
const songBtn = document.getElementById("songBtn");
const songWindow = document.getElementById("songWindow");
songBtn.addEventListener("click", () => openWindow(songWindow));

// Arcade (Game)
const gameBtn = document.getElementById("gameBtn");
const gameWindow = document.getElementById("gameWindow");
gameBtn.addEventListener("click", () => openWindow(gameWindow));

// Terminal
const terminalBtn = document.getElementById("terminalBtn");
const terminalWindow = document.getElementById("terminalWindow");
terminalBtn.addEventListener("click", () => openWindow(terminalWindow));

// Resume
const resumeBtn = document.getElementById("resumeBtn");
const resumeWindow = document.getElementById("resumeWindow");
resumeBtn.addEventListener("click", () => openWindow(resumeWindow));

document.getElementById("resumeViewBtn").addEventListener("click", () => {
    window.open("assets/Resume/Resume.pdf", "_blank");
});

document.getElementById("resumeDownloadBtn").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = "assets/Resume/Resume.pdf";
    a.download = "Vishal_Resume.pdf";
    a.click();
});