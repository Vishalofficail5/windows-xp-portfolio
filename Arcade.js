// ARCADE — game launcher for the desktop's "Game" app.
//
// HOW TO ADD ANOTHER GAME LATER:
// Just add one more object to the GAMES array below, e.g.
//   { id: "my-third-game", title: "My Third Game",
//     icon: "assets/icons/game.png",
//     path: "assets/Games/MyThirdGame.html", available: true }
// Drop that game's own self-contained file/folder under assets/Games/,
// and it'll show up as a new tile automatically — no other changes
// needed anywhere else in the code.

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

    // Build the tile grid from GAMES
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
        // Cache-bust: forces a fresh fetch every time, so an edited game
        // file always shows up immediately instead of a stale cached copy.
        frame.src = game.path + "?v=" + Date.now();
        arcadeView.style.display = "none";
        playView.style.display = "flex";
        // Give the iframe keyboard focus so driving controls work right away
        setTimeout(() => frame.focus(), 50);
    }

    // Fully unloads the running game (stops its render loop / audio / CPU
    // use) rather than just hiding it — this is what keeps things lag-free
    // once you've got more than one game in here.
    function stopGame() {
        frame.src = "about:blank";
        playView.style.display = "none";
        arcadeView.style.display = "flex";
    }

    backBtn.addEventListener("click", stopGame);

    // Stop the game whenever the Arcade window closes or minimizes —
    // an off-screen 3D game left running is exactly the kind of thing
    // that causes background lag.
    if (closeBtn) closeBtn.addEventListener("click", stopGame);
    if (minimizeBtn) minimizeBtn.addEventListener("click", stopGame);

    // Exposed so the Home button (desktop.js) can stop the game too,
    // the same way it already stops Lotify's audio.
    window.stopArcadeGame = stopGame;
})();