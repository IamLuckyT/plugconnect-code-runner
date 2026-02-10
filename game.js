const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* ---------- CANVAS ---------- */
let groundY;

function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth - 40, 900);
  canvas.height = 300;
  groundY = canvas.height - 80;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ---------- IMAGES ---------- */
const playerImg = new Image();
const bugImg = new Image();

playerImg.src = "assets/player.png";
bugImg.src = "assets/bug.png";

/* ---------- GAME STATE ---------- */
let gameSpeed = 4;
let gravity = 0.5;
let score = 0;
let gameOver = false;

/* ---------- PLAYER ---------- */
const player = {
  x: 50,
  y: 0,
  width: 48,
  height: 48,
  frameX: 0,
  maxFrames: 4,
  frameTimer: 0,
  frameInterval: 8,
  velocityY: 0,
  jumping: false
};

/* ---------- BUG ---------- */
const bug = {
  x: canvas.width,
  y: 0,
  width: 40,
  height: 30
};

/* ---------- INPUT ---------- */
document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

function jump() {
  if (!player.jumping) {
    player.velocityY = -12;
    player.jumping = true;
  }
}

/* ---------- UPDATE ---------- */
function update() {
  if (gameOver) return;

  // Animate player
  player.frameTimer++;
  if (player.frameTimer >= player.frameInterval) {
    player.frameX = (player.frameX + 1) % player.maxFrames;
    player.frameTimer = 0;
  }

  // Gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

  if (player.y >= groundY) {
    player.y = groundY;
    player.velocityY = 0;
    player.jumping = false;
  }

  // Bug movement
  bug.x -= gameSpeed;
  if (bug.x < -bug.width) {
    bug.x = canvas.width + Math.random() * 200;
    score++;
  }

  // Collision
  if (
    player.x < bug.x + bug.width &&
    player.x + player.width > bug.x &&
    player.y < bug.y + bug.height &&
    player.y + player.height > bug.y
  ) {
    gameOver = true;
  }
}

/* ---------- DRAW ---------- */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // PLAYER SPRITE
  const frameWidth = playerImg.width / player.maxFrames;
  const frameHeight = playerImg.height;

  ctx.drawImage(
    playerImg,
    player.frameX * frameWidth,
    0,
    frameWidth,
    frameHeight,
    player.x,
    player.y,
    frameWidth * 2,
    frameHeight * 2
  );

  // BUG
  ctx.drawImage(bugImg, bug.x, bug.y, bug.width, bug.height);

  // SCORE
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);

  if (gameOver) {
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, 150);
  }
}

/* ---------- LOOP ---------- */
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

/* ---------- START AFTER ASSETS LOAD ---------- */
let loaded = 0;

function startGame() {
  loaded++;
  if (loaded === 2) {
    player.y = groundY;
    bug.y = groundY + 15;
    loop();
  }
}

playerImg.onload = startGame;
bugImg.onload = startGame;
