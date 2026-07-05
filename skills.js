const skills = [
    { name: "Python", percent: 85, icon: "assets/icons/python.png" },
    { name: "C", percent: 80, icon: "assets/icons/c.png" },
    { name: "Prolog", percent: 70, icon: "assets/icons/prolog.png" },
    { name: "HTML5", percent: 88, icon: "assets/icons/html5.png" },
    { name: "CSS3", percent: 85, icon: "assets/icons/css3.png" },
    { name: "Java", percent: 78, icon: "assets/icons/java.png" },
    { name: "JavaScript", percent: 80, icon: "assets/icons/js.png" },
    { name: "Git & GitHub", percent: 85, icon: "assets/icons/git.png" },
];

const SEGMENTS = 10;
const skillList = document.getElementById("skillList");

skills.forEach(skill => {
    const filled = Math.round((skill.percent / 100) * SEGMENTS);

    const row = document.createElement("div");
    row.className = "skill-row";

    const label = document.createElement("div");
    label.className = "skill-name";
    label.innerHTML = `${skill.icon ? `<img src="${skill.icon}" alt="${skill.name}">` : ""}<span>${skill.name} ${skill.percent}%</span>`;

    const meter = document.createElement("div");
    meter.className = "skill-meter";

    for (let i = 0; i < SEGMENTS; i++) {
        const block = document.createElement("div");
        block.className = "skill-block" + (i < filled ? " filled" : "");
        meter.appendChild(block);
    }

    row.appendChild(label);
    row.appendChild(meter);
    skillList.appendChild(row);
});