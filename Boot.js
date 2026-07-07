(function () {
    const screen = document.getElementById("bootScreen");
    if (!screen) return;

    const stage1 = document.getElementById("bootStage1");
    const stage2 = document.getElementById("bootStage2");
    const stage3 = document.getElementById("bootStage3");
    const stage4 = document.getElementById("bootStage4");

    const barFill = document.getElementById("bootBiosBar");
    const barPercent = document.getElementById("bootBiosPercent");
    const dotsEl = document.getElementById("bootBiosDots");
    const logText = document.getElementById("bootLogText");
    const sound = document.getElementById("bootSound");
    const pressKeyEl = document.getElementById("bootPressKey");

    const LOG_LINES = [
        "",
        "This driver is provided by Oak Technology, Inc..",
        "OTI-91X ATAPI CD-ROM device driver, Rev D91XV352",
        "(C)Copyright Oak Technology Inc. 1987-1997",
        "  Device Name     : MSCD0001",
        "  Transfer Mode   : Programmed I/O",
        "  Number of drives : 1",
        "",
        "MODE prepare code page function completed",
        "",
        "MODE select code page function completed"
    ];

    function showStage(stage) {
        [stage1, stage2, stage3, stage4].forEach(s => s.classList.remove("boot-stage-active"));
        stage.classList.add("boot-stage-active");
    }

    function runBiosBar(onDone) {
        let pct = 0;
        const timer = setInterval(() => {
            pct += 4 + Math.floor(Math.random() * 8);
            if (pct >= 100) pct = 100;
            barFill.style.width = pct + "%";
            barPercent.textContent = pct + "%";
            if (pct >= 100) {
                clearInterval(timer);
                setTimeout(onDone, 300);
            }
        }, 90);
    }

    function runDots(onDone) {
        let count = 0;
        const timer = setInterval(() => {
            count = (count % 3) + 1;
            dotsEl.textContent = ".".repeat(count);
        }, 300);
        setTimeout(() => {
            clearInterval(timer);
            onDone();
        }, 900);
    }

    function playBootSound() {
        if (!sound) return;
        sound.currentTime = 0;
        const attempt = sound.play();
        if (attempt && attempt.catch) {
            attempt.catch(() => {
            });
        }
    }

    function stopBootSound() {
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
    }

    function typeLogLines(onDone) {
        let i = 0;
        function next() {
            if (i >= LOG_LINES.length) {
                setTimeout(onDone, 500);
                return;
            }
            const line = document.createElement("span");
            line.className = "boot-log-line";
            line.textContent = LOG_LINES[i] || "\u00A0";
            logText.appendChild(line);
            i++;
            setTimeout(next, 180);
        }
        next();
    }

    function finishBoot() {
        stopBootSound();
        screen.classList.add("boot-hidden");
        screen.addEventListener("animationend", () => {
            screen.remove();
        }, { once: true });
    }

    function waitForKey(onDone) {
        if (!pressKeyEl) {
            onDone();
            return;
        }
        const go = () => {
            document.removeEventListener("click", go);
            document.removeEventListener("keydown", go);
            pressKeyEl.style.display = "none";
            onDone();
        };
        document.addEventListener("click", go, { once: true });
        document.addEventListener("keydown", go, { once: true });
    }

    // ---- run the sequence ----
    showStage(stage1);
    waitForKey(() => {
        runBiosBar(() => {
            runDots(() => {
                showStage(stage2);
                setTimeout(() => {
                    showStage(stage3);
                    playBootSound();
                    setTimeout(() => {
                        showStage(stage4);
                        typeLogLines(finishBoot);
                    }, 2200);
                }, 700);
            });
        });
    });
})();