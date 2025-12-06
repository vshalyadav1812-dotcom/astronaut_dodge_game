const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const gameOverScreen = document.getElementById("gameOver");
const startScreen = document.getElementById("startScreen");
const secretModal = document.getElementById("secretModal");
const secretText = document.getElementById("secretText");
const finalScoreText = document.getElementById("finalScore");
const planetDiv = document.getElementById("planet");

let score = 0;
let lives = 3;
let isGameOver = false;
let isPlaying = false;
let isPaused = false;
let speed = 3;
let asteroidInterval;
let gameLoopId;

const spaceFacts = [
    "A day on Venus is longer than a year on Venus.",
    "Space is completely silent.",
    "One million Earths could fit inside the Sun.",
    "The sunset on Mars appears blue.",
    "There are more stars in the universe than grains of sand on Earth.",
    "Neutron stars can spin at a rate of 600 rotations per second.",
    "The footprints on the Moon will be there for 100 million years.",
    "99% of our solar system's mass is the Sun.",
    "If two pieces of the same type of metal touch in space, they will bond and be permanently stuck together.",
    "The largest known asteroid is 965 km (600 mi) wide.",
    "The Moon is drifting away from Earth at a rate of 3.8 cm per year.",
    "There is a planet made of diamonds called 55 Cancri e.",
    "A light-year is the distance light travels in one year: about 6 trillion miles.",
    "The center of the Milky Way smells like raspberries and tastes like rum.",
    "Saturn is the only planet that could float in water.",
    "The Great Red Spot on Jupiter is a storm that has been raging for over 300 years.",
    "Olympus Mons on Mars is the tallest mountain in the solar system, 3 times taller than Everest.",
    "Uranus spins on its side.",
    "Pluto is smaller than the United States.",
    "There are more trees on Earth than stars in the Milky Way.",
    "The hottest planet is Venus, not Mercury.",
    "A full NASA space suit costs $12,000,000.",
    "The universe is estimated to be 13.8 billion years old.",
    "Black holes are not holes, but incredibly dense matter.",
    "Sound cannot travel through the vacuum of space.",
    "Halley's Comet will pass Earth again in 2061.",
    "Enceladus, a moon of Saturn, reflects 90% of the Sun's light.",
    "The Whirlpool Galaxy was the first celestial object identified as being spiral."
];

// Audio Context
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'powerup') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'secret') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.2);
        osc.frequency.linearRampToValueAtTime(1000, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
    }
}

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Touch controls
let touchStartX = 0;
gameArea.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
});
gameArea.addEventListener('touchmove', e => {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const diff = touchX - touchStartX;
    const left = parseInt(window.getComputedStyle(player).left);

    if (diff > 0 && left < (gameArea.clientWidth - 50)) {
        player.style.left = (left + 5) + "px";
    } else if (diff < 0 && left > 0) {
        player.style.left = (left - 5) + "px";
    }
    touchStartX = touchX;
});

function movePlayer() {
    let left = parseInt(window.getComputedStyle(player).left);
    const gameWidth = gameArea.clientWidth;

    if (keys["ArrowLeft"] && left > 0) {
        player.style.left = (left - 12) + "px";
    }
    if (keys["ArrowRight"] && left < (gameWidth - 50)) {
        player.style.left = (left + 12) + "px";
    }
}

function createEntity() {
    if (!isPlaying || isPaused) return;

    let entity = document.createElement("div");
    entity.classList.add("entity");

    const rand = Math.random();
    let type = "asteroid";

    // Adjusted Spawn Rates
    // Adjusted Spawn Rates (High Loot Mode)
    if (rand < 0.50) type = "asteroid"; // 50%
    else if (rand < 0.65) type = "alien"; // 15%
    else if (rand < 0.75) type = "ship"; // 10%
    else if (rand < 0.90) type = "energy-drink"; // 15% (Increased)
    else type = "scroll"; // 10% (Increased)

    entity.classList.add(type);
    entity.dataset.type = type;

    entity.style.top = "-50px";
    const gameWidth = gameArea.clientWidth;
    entity.style.left = Math.floor(Math.random() * (gameWidth - 50)) + "px";

    if (type === "asteroid" || type === "ship") {
        entity.style.transform = `rotate(${Math.random() * 360}deg)`;
        entity.dataset.rotationSpeed = (Math.random() - 0.5) * 10;
    } else {
        entity.dataset.rotationSpeed = 0;
    }

    entity.dataset.drift = Math.random() < 0.5 ? -1 : 1;

    // Aliens move faster
    if (type === "alien") entity.dataset.speedMod = 2;
    else entity.dataset.speedMod = 0;

    gameArea.appendChild(entity);
}

function checkCollision(a, b) {
    let ar = a.getBoundingClientRect();
    let br = b.getBoundingClientRect();
    const padding = 10;
    return !(ar.right < br.left + padding ||
        ar.left > br.right - padding ||
        ar.bottom < br.top + padding ||
        ar.top > br.bottom - padding);
}

function gameLoop() {
    if (isGameOver || !isPlaying || isPaused) return;

    movePlayer();

    score++;
    scoreText.textContent = "Score: " + score;

    // Solar System Tour Logic
    if (planetDiv) {
        const stages = [
            { score: 0, class: "planet-mercury", name: "MERCURY ORBIT" },
            { score: 1500, class: "planet-venus", name: "APPROACHING VENUS" },
            { score: 3000, class: "planet-earth", name: "EARTH FLYBY" },
            { score: 4500, class: "planet-moon", name: "LUNAR LANDING" },
            { score: 6000, class: "planet-mars", name: "MARS COLONY" },
            { score: 7500, class: "moon-phobos", name: "PHOBOS OUTPOST" },
            { score: 9000, class: "planet-jupiter", name: "JUPITER GIANT" },
            { score: 10500, class: "moon-io", name: "IO VOLCANOES" },
            { score: 12000, class: "moon-europa", name: "EUROPA ICE" },
            { score: 13500, class: "planet-saturn", name: "SATURN RINGS" },
            { score: 15000, class: "moon-titan", name: "TITAN HAZE" },
            { score: 16500, class: "planet-uranus", name: "URANUS ICE" },
            { score: 18000, class: "planet-neptune", name: "NEPTUNE WINDS" },
            { score: 19500, class: "moon-triton", name: "TRITON GEYSERS" },
            { score: 21000, class: "planet-pluto", name: "PLUTO OUTPOST" },
            { score: 22500, class: "moon-charon", name: "CHARON SHADOW" },
            { score: 24000, class: "planet-nebula", name: "LEAVING SOLAR SYSTEM" }
        ];

        // Find current stage
        let currentStage = stages[0];
        for (let i = stages.length - 1; i >= 0; i--) {
            if (score >= stages[i].score) {
                currentStage = stages[i];
                break;
            }
        }

        // Apply class if changed
        if (!planetDiv.classList.contains(currentStage.class)) {
            planetDiv.className = currentStage.class;
            showZoneNotification(currentStage.name);

            // Animate planet rising
            planetDiv.style.bottom = "-300px";
            setTimeout(() => planetDiv.style.bottom = "-100px", 50);
        }
    }

    if (score % 500 === 0) speed += 0.5;

    let entities = document.querySelectorAll(".entity");
    entities.forEach(e => {
        let top = parseInt(e.style.top);
        let moveSpeed = speed + Number(e.dataset.speedMod);
        e.style.top = (top + moveSpeed) + "px";

        let left = parseInt(e.style.left);
        e.style.left = (left + Number(e.dataset.drift)) + "px";

        let currentRotation = parseFloat(e.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
        if (Number(e.dataset.rotationSpeed) !== 0) {
            e.style.transform = `rotate(${currentRotation + Number(e.dataset.rotationSpeed)}deg)`;
        }

        if (checkCollision(e, player)) {
            const type = e.dataset.type;

            if (type === "asteroid" || type === "alien" || type === "ship") {
                playSound('hit');
                lives--;
                livesText.textContent = "Lives: " + lives;
                player.style.opacity = "0.5";
                setTimeout(() => player.style.opacity = "1", 200);

                if (lives <= 0) endGame();
            } else if (type === "energy-drink") {
                playSound('powerup');
                lives++;
                livesText.textContent = "Lives: " + lives;
            } else if (type === "scroll") {
                playSound('secret');
                showSecret();
            }

            e.remove();
        }

        if (top > gameArea.clientHeight) e.remove();
    });

    gameLoopId = requestAnimationFrame(gameLoop);
}

function showZoneNotification(text) {
    const note = document.createElement("div");
    note.textContent = text;
    note.style.position = "absolute";
    note.style.top = "20%";
    note.style.width = "100%";
    note.style.textAlign = "center";
    note.style.color = "#00f3ff";
    note.style.fontFamily = "'Orbitron', sans-serif";
    note.style.fontSize = "24px";
    note.style.textShadow = "0 0 10px #00f3ff";
    note.style.opacity = "0";
    note.style.transition = "opacity 0.5s";
    note.style.zIndex = "50";

    gameArea.appendChild(note);

    // Fade in
    requestAnimationFrame(() => note.style.opacity = "1");

    // Fade out and remove
    setTimeout(() => {
        note.style.opacity = "0";
        setTimeout(() => note.remove(), 500);
    }, 2000);
}

function showSecret() {
    isPaused = true;
    const fact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
    secretText.textContent = fact;
    secretModal.classList.remove("hidden");
}

function closeSecret() {
    secretModal.classList.add("hidden");
    isPaused = false;
    gameLoop();
}

function startGame() {
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    secretModal.classList.add("hidden");
    isPlaying = true;
    isGameOver = false;
    isPaused = false;
    score = 0;
    lives = 3;
    speed = 3;
    scoreText.textContent = "Score: 0";
    livesText.textContent = "Lives: 3";

    player.style.left = (gameArea.clientWidth / 2 - 25) + "px";

    document.querySelectorAll(".entity").forEach(e => e.remove());

    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (asteroidInterval) clearInterval(asteroidInterval);
    asteroidInterval = setInterval(createEntity, 800);
    gameLoop();
}

function endGame() {
    isGameOver = true;
    isPlaying = false;
    clearInterval(asteroidInterval);
    cancelAnimationFrame(gameLoopId);
    gameOverScreen.classList.remove("hidden");
    finalScoreText.textContent = "Score: " + score;
}

function restartGame() {
    startGame();
}

function exitGame() {
    isGameOver = true;
    isPlaying = false;
    isPaused = false;
    clearInterval(asteroidInterval);
    cancelAnimationFrame(gameLoopId);
    gameOverScreen.classList.add("hidden");
    secretModal.classList.add("hidden");
    startScreen.classList.remove("hidden");
    document.querySelectorAll(".entity").forEach(e => e.remove());
}

// Initial setup
player.style.left = "375px";
