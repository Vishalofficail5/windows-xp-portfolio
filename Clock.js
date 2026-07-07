const clockDay = document.getElementById("clockDay");
const clockTime = document.getElementById("clockTime");

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function updateClock() {
    const now = new Date();

    clockDay.textContent = days[now.getDay()];

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    clockTime.textContent = `${hours}:${minutes} ${ampm}`;
}
updateClock();
setInterval(updateClock, 1000);