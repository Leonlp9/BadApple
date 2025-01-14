const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resolutionSlider = document.getElementById('resolution');
const upload = document.getElementById('upload');

const chars = ["@", "#", "S", "%", "?", "*", "+", ";", ":", ",", "."];

let resolution = 14;

function videoToAscii() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let asciiFrame = "";
    for (let y = 0; y < canvas.height; y += resolution) {
        for (let x = 0; x < canvas.width; x += resolution / 2) {
            const offset = (y * canvas.width + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];

            const brightness = (r + g + b) / 3;
            const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
            asciiFrame += chars[charIndex];
        }
        asciiFrame += "\n";
    }

    document.getElementById('console').innerText = asciiFrame;
}

video.addEventListener('play', () => {
    const interval = setInterval(() => {
        if (!video.paused && !video.ended) {
            videoToAscii();
        } else {
            clearInterval(interval);
        }
    }, 1000 / 30); // 30 FPS
});

resolutionSlider.addEventListener('input', (event) => {
    resolution = parseInt(event.target.value);
});

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        video.src = url;
        video.load();
        video.play();
    }
});