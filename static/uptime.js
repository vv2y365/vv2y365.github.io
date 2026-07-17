function updateUptime() {
    const startTime = new Date("2026-06-07T17:55:00+08:00");
    const now = new Date();

    let diff = Math.floor((now - startTime) / 1000);

    const days = Math.floor(diff / 86400);
    diff %= 86400;

    const hours = Math.floor(diff / 3600);
    diff %= 3600;

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    const pad = (n) => String(n).padStart(2, "0");

    document.getElementById("uptime").innerText =
        `${days} days, ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

setInterval(updateUptime, 1000);
updateUptime();