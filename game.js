const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth - 40, 900);
  canvas.height = 300;
}

const groundY = canvas.height - 80;

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

//PLAYER AND BUG IMAGES
const playerImg = new Image();
playerImg.src = "assets/player.png";

const bugImg = new Image();
bugImg.src = "assets/bug.png";

// GAME STATE
let gameSpeed = 4;
let gravity = 0.5;
let score = 0;
let gameOver = false;

// PLAYER
const player = {
  x: 50,
  y: groundY,
  width: 48,
  height: 48,

  frameX: 0,
  maxFrames: 4,
  frameTimer: 0,
  frameInterval: 8,

  velocityY: 0,
  jumping: false
};

// BUG (OBSTACLE)
const bug = {
  x: canvas.width,
  y: 320,
  width: 50,
  height: 40
};

// INPUT
document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

function jump() {
  if (!player.jumping) {
    player.velocityY = -12;
    player.jumping = true;
  }
}

// UPDATE
function update() {
  if (gameOver) return;

  // Animate player
  player.frameTimer++;
  if (player.frameTimer >= player.frameInterval) {
    player.frameX = (player.frameX + 1) % player.maxFrames;
    player.frameTimer = 0;
  }

  // Player physics
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
    bug.x = canvas.width;
    score++;
  }

  // Collision detection
  if (
    player.x < bug.x + bug.width &&
    player.x + player.width > bug.x &&
    player.y < bug.y + bug.height &&
    player.y + player.height > bug.y
  ) {
    gameOver = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

// PLAYER SPRITE
ctx.drawImage(
  playerImg,
  player.frameX * 48, // source X
  0,                 // source Y
  48,                // frame width
  48,                // frame height
  player.x,
  player.y,
  64,                // scale UP
  64
);


// BUG SPRITE
  ctx.drawImage(
    bugImg,
    bug.x,
    bug.y,
    bug.width,
    bug.height
  );

// SCORE
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);

// GAME OVER
  if (gameOver) {
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 350, 200);
  }
}

// GAME LOOP
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

let assetsLoaded = 0;

playerImg.onload = () => {
  assetsLoaded++;
  if (assetsLoaded === 2) loop();
};

bugImg.onload = () => {
  assetsLoaded++;
  if (assetsLoaded === 2) loop();
};

