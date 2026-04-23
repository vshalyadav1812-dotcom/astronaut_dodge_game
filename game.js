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
    "The Whirlpool Galaxy was the first celestial object identified as being spiral.",
    "The Sun is a star at the center of our solar system.",
    "There are eight planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
    "Jupiter is the largest planet, about 11 times wider than Earth.",
    "Saturn is famous for its spectacular ring system made of ice and rock.",
    "Mercury is the closest planet to the Sun.",
    "Earth is the only planet known to support life.",
    "Mars is called the 'Red Planet' because of its reddish appearance caused by iron oxide.",
    "Venus rotates in the opposite direction to most planets.",
    "Neptune has the strongest winds in the solar system, reaching up to 1,200 miles per hour.",
    "Uranus is tilted on its side, making its seasons extremely long.",
    "The asteroid belt lies between Mars and Jupiter.",
    "Dwarf planets, like Pluto, are smaller than regular planets but still orbit the Sun.",
    "The moon is Earth's only natural satellite.",
    "The planet Mercury has no moons.",
    "Saturn's moon Titan has lakes of liquid methane and ethane.",
    "Stars are huge balls of burning gases, mostly hydrogen and helium.",
    "Our Sun is a medium-sized star called a yellow dwarf.",
    "The closest star to Earth, other than the Sun, is Proxima Centauri.",
    "Stars come in different colors depending on their temperature: blue, white, yellow, orange, and red.",
    "The universe contains billions of galaxies, each holding billions of stars.",
    "The Milky Way galaxy is the galaxy that contains our solar system.",
    "Some stars are much larger than the Sun; these are called supergiants.",
    "When stars run out of fuel, they can explode in a supernova.",
    "Black holes are formed when massive stars collapse under their own gravity.",
    "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.",
    "The closest galaxy to the Milky Way is the Andromeda Galaxy.",
    "There are stars that are so far away that their light takes millions of years to reach us.",
    "Neutron stars are incredibly dense remnants of supernova explosions.",
    "The brightest star in the night sky is Sirius.",
    "Some stars have planets orbiting them, called exoplanets.",
    "The oldest stars in the universe are over 13 billion years old.",
    "The universe is expanding, meaning galaxies are moving away from each other.",
    "The Hubble Space Telescope has helped us see distant galaxies in stunning detail.",
    "Stars can form in giant clouds of gas and dust called nebulae.",
    "The color of a star can tell us how hot it is.",
    "A solar eclipse happens when the Moon passes between the Sun and Earth.",
    "A lunar eclipse occurs when the Earth casts a shadow on the Moon.",
    "Meteor showers happen when Earth passes through debris left by comets.",
    "Comets are icy objects that develop tails when they get close to the Sun.",
    "The Northern Lights (Aurora Borealis) occur when particles from the Sun interact with Earth's atmosphere.",
    "The speed of light is about 186,282 miles per second.",
    "Space is a vacuum, meaning it has no air or atmosphere.",
    "The vacuum of space allows objects to move without air resistance.",
    "The Voyager spacecraft have traveled beyond our solar system.",
    "The Milky Way is moving through space at about 1.3 million miles per hour.",
    "Black holes can trap light, making them invisible.",
    "Wormholes are theoretical passages through space-time that could connect distant parts of the universe.",
    "The planet Mercury has a very thin atmosphere called an exosphere.",
    "Spacecraft can land on planets and moons to explore their surfaces.",
    "The James Webb Space Telescope will help us see even further into space.",
    "Space debris, like old satellites and rocket parts, orbits Earth.",
    "A day on Mercury lasts 176 Earth days.",
    "The Moon's gravity causes Earth's tides.",
    "The Sun's energy is generated by nuclear fusion in its core.",
    "The first human to walk on the Moon was Neil Armstrong in 1969.",
    "The Apollo 11 mission marked the first successful moon landing.",
    "Astronauts wear space suits that provide oxygen and protect them from the vacuum of space.",
    "The International Space Station orbits Earth about every 90 minutes.",
    "Astronauts on the ISS experience about 16 sunrises and sunsets each day.",
    "Space food is specially prepared to be lightweight and nutritious.",
    "The longest space mission by a NASA astronaut lasted over a year.",
    "Spacewalks are called extravehicular activities (EVAs).",
    "Robots and rovers help explore planets like Mars.",
    "The Mars rovers, like Curiosity and Perseverance, have been exploring the planet's surface.",
    "Space agencies plan to send humans to Mars in the future.",
    "The first satellite launched into space was Sputnik 1 in 1957.",
    "Space tourism is becoming a reality with private companies offering trips to space.",
    "The first space hotel is being planned for the future.",
    "Astronauts have to exercise regularly in space to stay healthy.",
    "Space stations have laboratories for conducting scientific experiments.",
    "Spacecraft use thrusters to change direction and speed.",
    "The Hubble Space Telescope has been in orbit since 1990.",
    "Space missions require precise calculations and planning.",
    "Space is dangerous, with hazards like radiation and micrometeoroids.",
    "The Sun makes up 99.86% of the mass in the solar system.",
    "The closest black hole to Earth is about 1,000 light-years away.",
    "Space smells like burnt steak, according to astronauts.",
    "The coldest place in the universe is the Boötes Void, a massive space of almost empty space.",
    "There are planets with water, ice, and even lakes of liquid methane.",
    "The Earth's atmosphere protects us from most space debris.",
    "The largest asteroid, Ceres, is also classified as a dwarf planet.",
    "Some scientists believe there might be other universes beyond ours.",
    "The universe is constantly expanding, and this expansion is speeding up.",
    "The Milky Way and Andromeda galaxies will collide in about 4.5 billion years.",
    "The Sun will eventually become a white dwarf after burning out all its fuel.",
    "Space suits weigh about 280 pounds on Earth but feel weightless in space.",
    "The planet Uranus has a faint ring system."
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
