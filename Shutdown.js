(function () {
    const overlay = document.getElementById("shutdownOverlay");
    const waitScreen = document.getElementById("shutdownWaitScreen");
    const finalScreen = document.getElementById("shutdownFinalScreen");

    if (!overlay || !waitScreen || !finalScreen) return;

    const yesBtn = document.getElementById("shutdownYesBtn");
    const noBtn = document.getElementById("shutdownNoBtn");
    const helpBtn = document.getElementById("shutdownHelpBtn");
    const xBtn = document.getElementById("shutdownDialogX");

    function openDialog() {
        overlay.classList.add("shutdown-overlay-active");
    }

    function closeDialog() {
        overlay.classList.remove("shutdown-overlay-active");
    }

    function getSelectedAction() {
        const checked = overlay.querySelector('input[name="shutdownAction"]:checked');
        return checked ? checked.value : "shutdown";
    }

    function runShutdownSequence() {
        const action = getSelectedAction();
        closeDialog();

        if (typeof window.stopLotify === "function") {
            window.stopLotify();
        }
        if (typeof window.stopArcadeGame === "function") {
            window.stopArcadeGame();
        }

        waitScreen.classList.add("shutdown-stage-active");

        setTimeout(() => {
            if (action === "shutdown") {
                waitScreen.classList.remove("shutdown-stage-active");
                finalScreen.classList.add("shutdown-stage-active");
            } else {
                location.reload();
            }
        }, 2200);
    }

    yesBtn.addEventListener("click", runShutdownSequence);
    noBtn.addEventListener("click", closeDialog);
    xBtn.addEventListener("click", closeDialog);
    helpBtn.addEventListener("click", () => {
    });

    window.startShutdownSequence = openDialog;
})();