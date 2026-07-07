const titleBtns = document.querySelectorAll(".title-btn");
titleBtns.forEach(btn => {
    const tooltip = btn.querySelector(".btn-tooltip");
    let timer;
    btn.addEventListener("mouseenter", () => {
        timer = setTimeout(() => {
            tooltip.style.display = "block";
        }, 800);
    });
    btn.addEventListener("mouseleave", () => {
        clearTimeout(timer);
        tooltip.style.display = "none";
    });
});
