// ALL WINDOWS
const windows = document.querySelectorAll(".window");
let highestZ = 100;

// TASKBAR
const runningApps = document.querySelector(".running-apps");
const taskbarButtons = {};

function setActiveTaskbarButton(windowElement) {
    const id = windowElement.id;
    Object.entries(taskbarButtons).forEach(([btnId, btn]) => {
        btn.classList.toggle("active", btnId === id);
    });
}

function bringToFront(windowElement) {
    highestZ++;
    windowElement.style.zIndex = highestZ;
    setActiveTaskbarButton(windowElement);
}

function createTaskbarButton(windowElement) {
    const id = windowElement.id;
    if (taskbarButtons[id]) return;

    const icon = windowElement.querySelector(".title-left img").src;
    const title = windowElement.querySelector(".title-left span").textContent;

    const btn = document.createElement("button");
    btn.className = "app-btn";
    btn.innerHTML = `<img src="${icon}" alt=""><span>${title}</span>`;

    btn.addEventListener("click", () => {

        if (windowElement.style.display === "none") {
            openWindow(windowElement);
            return;
        }

        bringToFront(windowElement);

    });
    runningApps.appendChild(btn);
    taskbarButtons[id] = btn;
}

function removeTaskbarButton(windowElement) {
    const id = windowElement.id;
    if (taskbarButtons[id]) {
        taskbarButtons[id].remove();
        delete taskbarButtons[id];
    }
}

function openWindow(windowElement) {

    if (windowElement.style.display === "flex") {
        bringToFront(windowElement);
        return;
    }

    windowElement.style.display = "flex";

    windowElement.classList.remove(
        "window-opening",
        "window-closing",
        "window-minimize"
    );

    void windowElement.offsetWidth;

    windowElement.classList.add("window-opening");

    bringToFront(windowElement);
    createTaskbarButton(windowElement);

    windowElement.addEventListener("animationend", () => {
        windowElement.classList.remove("window-opening");
    }, { once: true });

    showLoadingOverlay(windowElement, () => {
        if (windowElement.id === "terminalWindow" && typeof window.focusTerminal === "function") {
            window.focusTerminal();
        }
    });
}

// SETUP EVERY WINDOW

windows.forEach(windowElement => {

    const closeBtn = windowElement.querySelector(".closeBtn");
    const minimizeBtn = windowElement.querySelector(".minimizeBtn");
    const maximizeBtn = windowElement.querySelector(".maximizeBtn");
    const titleBar = windowElement.querySelector(".title-bar");

    // OPEN TO FRONT
    windowElement.addEventListener("mousedown", () => {
        highestZ++;
        windowElement.style.zIndex = highestZ;
        setActiveTaskbarButton(windowElement);
    });

    // CLOSE
    closeBtn.addEventListener("click", () => {

        windowElement.classList.remove("window-opening");
        windowElement.classList.add("window-closing");

        windowElement.addEventListener("animationend", () => {

            windowElement.style.display = "none";
            windowElement.classList.remove("window-closing");
            removeTaskbarButton(windowElement);

        }, { once: true });

    });

    // MINIMIZE
    minimizeBtn.addEventListener("click", () => {

        windowElement.classList.remove("window-opening");
        windowElement.classList.add("window-minimize");

        windowElement.addEventListener("animationend", () => {

            windowElement.style.display = "none";
            windowElement.classList.remove("window-minimize");

        }, { once: true });

    });
    // MAXIMIZE
    maximizeBtn.addEventListener("click", () => {
        windowElement.classList.toggle("maximize");
    });

    // DRAG

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titleBar.addEventListener("mousedown", (e) => {
        if (windowElement.classList.contains("maximize")) return;
        isDragging = true;
        offsetX = e.clientX - windowElement.offsetLeft;
        offsetY = e.clientY - windowElement.offsetTop;
        highestZ++;
        windowElement.style.zIndex = highestZ;
    });
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        windowElement.style.left = (e.clientX - offsetX) + "px";
        windowElement.style.top = (e.clientY - offsetY) + "px";
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
});
// START MENU
const startBtn = document.querySelector(".start-btn");
const startMenu = document.getElementById("startMenu");
const startMenuApps = document.getElementById("startMenuApps");

windows.forEach(windowElement => {
    const icon = windowElement.querySelector(".title-left img").src;
    const title = windowElement.querySelector(".title-left span").textContent;

    const item = document.createElement("button");
    item.className = "start-menu-item";
    item.innerHTML = `<img src="${icon}" alt="">${title}`;

    item.addEventListener("click", () => {
        openWindow(windowElement);
        startMenu.classList.remove("open");
    });

    startMenuApps.appendChild(item);
});

const extraApps = [
];

extraApps.forEach(app => {
    const item = document.createElement("button");
    item.className = "start-menu-item";
    item.innerHTML = `<img src="${app.icon}" alt="">${app.name}`;

    item.addEventListener("click", () => {
        document.getElementById(app.id).click();
        startMenu.classList.remove("open");
    });

    startMenuApps.appendChild(item);
});

startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    startMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {
    if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.remove("open");
    }
});

// RESTART
document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
});

// SHUT DOWN
document.getElementById("shutdownBtn").addEventListener("click", () => {
    if (typeof window.startShutdownSequence === "function") {
        window.startShutdownSequence();
    } else {
        document.body.innerHTML = `<div class="shutdown-screen">It's not safe to turn off your computer.</div>`;
    }
});
