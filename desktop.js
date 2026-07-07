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
aboutBtn.addEventListener("dblclick", () => openWindow(aboutWindow));

// Projects
const projectsBtn = document.getElementById("projectBtn");
const projectsWindow = document.getElementById("projectsWindow");
projectsBtn.addEventListener("dblclick", () => openWindow(projectsWindow));

// Experience
const experienceBtn = document.getElementById("experienceBtn");
const experienceWindow = document.getElementById("experienceWindow");
experienceBtn.addEventListener("dblclick", () => openWindow(experienceWindow));

// Contact
const contactBtn = document.getElementById("contactBtn");
const contactWindow = document.getElementById("contactWindow");
contactBtn.addEventListener("dblclick", () => openWindow(contactWindow));

// Lotify (Song)
const songBtn = document.getElementById("songBtn");
const songWindow = document.getElementById("songWindow");
songBtn.addEventListener("dblclick", () => openWindow(songWindow));

// Arcade (Game)
const gameBtn = document.getElementById("gameBtn");
const gameWindow = document.getElementById("gameWindow");
gameBtn.addEventListener("dblclick", () => openWindow(gameWindow));

// Terminal
const terminalBtn = document.getElementById("terminalBtn");
const terminalWindow = document.getElementById("terminalWindow");
terminalBtn.addEventListener("dblclick", () => openWindow(terminalWindow));

// Resume
const resumeBtn = document.getElementById("resumeBtn");
const resumeWindow = document.getElementById("resumeWindow");
resumeBtn.addEventListener("dblclick", () => openWindow(resumeWindow));

document.getElementById("resumeViewBtn").addEventListener("click", () => {
    window.open("assets/Resume/Resume.pdf", "_blank");
});

document.getElementById("resumeDownloadBtn").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = "assets/Resume/Resume.pdf";
    a.download = "Vishal_Resume.pdf";
    a.click();
});