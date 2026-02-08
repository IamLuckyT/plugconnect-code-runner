const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// GAME STATE
let gameSpeed = 4;
let gravity = 0.5;
let score = 0;
let gameOver = false;

// PLAYER
const player = {
  x: 50,
  y: 300,
  width: 60,
  height: 60,
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

  // Player physics
  player.velocityY += gravity;
  player.y += player.velocityY;

  if (player.y >= 300) {
    player.y = 300;
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

// DRAW
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Bug
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(bug.x, bug.y, bug.width, bug.height);

  // Score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);

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

loop();
