(function () {
    const GAMES = [
        {
            id: "highway-racer-3d",
            title: "Highway Racer 3D",
            icon: "assets/icons/game.png",
            path: "assets/Games/Index.html",
            available: true
        },
        {
            id: "dead-mansion",
            title: "Dead Mansion",
            icon: "assets/icons/game.png",
            path: "assets/Games/Game2.html",
            available: true
        }
    ];

    const win = document.getElementById("gameWindow");
    const arcadeView = document.getElementById("arcadeView");
    const playView = document.getElementById("arcadePlayView");
    const grid = document.getElementById("arcadeGrid");
    const backBtn = document.getElementById("arcadeBackBtn");
    const titleEl = document.getElementById("arcadeGameTitle");
    const frame = document.getElementById("arcadeFrame");
    const closeBtn = win.querySelector(".closeBtn");
    const minimizeBtn = win.querySelector(".minimizeBtn");

    GAMES.forEach(game => {
        const tile = document.createElement("div");
        tile.className = "arcade-tile" + (game.available ? "" : " locked");
        tile.innerHTML = `<img src="${game.icon}" alt=""><span>${game.title}</span>`;
        if (game.available) {
            tile.addEventListener("click", () => launchGame(game));
        }
        grid.appendChild(tile);
    });

    function launchGame(game) {
        titleEl.textContent = game.title;
        frame.src = game.path + "?v=" + Date.now();
        arcadeView.style.display = "none";
        playView.style.display = "flex";
        setTimeout(() => frame.focus(), 50);
    }

    function stopGame() {
        frame.src = "about:blank";
        playView.style.display = "none";
        arcadeView.style.display = "flex";
    }

    backBtn.addEventListener("click", stopGame);

    if (closeBtn) closeBtn.addEventListener("click", stopGame);
    if (minimizeBtn) minimizeBtn.addEventListener("click", stopGame);

    window.stopArcadeGame = stopGame;
})();