const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 50,
  width: 50,
  height: 50
};

let isShooting = false;
const bullets = [];
const bulletSpeed = 5;
const playerImg = new Image();
playerImg.src = "/GAME/finalgame/pistol.jpeg";

// Draw the player
function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Bullet and shooting
canvas.addEventListener('mousedown', () => {
  isShooting = true;
  shoot();
});

canvas.addEventListener('mouseup', () => {
  isShooting = false;
});

function shoot() {
  if (isShooting) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    const bullet = {
      x: player.x + player.width / 2 - 2.5,
      y: player.y,
      dx: mouseX - (player.x + player.width / 2),
      dy: mouseY - player.y,
      speed: bulletSpeed
    };

    const distance = Math.sqrt(bullet.dx ** 2 + bullet.dy ** 2);
    bullet.dx /= distance;
    bullet.dy /= distance;

    bullet.dx *= bullet.speed;
    bullet.dy *= bullet.speed;

    bullets.push(bullet);
  }
}

function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;

    if (bullet.y < 0 || bullet.x < 0 || bullet.x > canvas.width || bullet.y > canvas.height) {
      bullets.splice(index, 1);
    }
  });
}

function drawBullets() {
  ctx.fillStyle = 'red';
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, 5, 10);
  });
}

const enemies = [];
const enemySpeedRange = [0.5, 2];

function spawnRandomEnemy() {
  const enemy = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    width: 30,
    height: 30,
    isVisible: true
  };

  enemies.push(enemy);
}

function spawnMovingEnemy() {
  const isMovingLeft = Math.random() < 0.5;
  const speed = Math.random() * (enemySpeedRange[1] - enemySpeedRange[0]) + enemySpeedRange[0];
  const verticalPosition = Math.random() * canvas.height;

  const enemy = {
    x: isMovingLeft ? canvas.width : 0,
    y: verticalPosition,
    width: 40,
    height: 20,
    isMovingLeft: isMovingLeft,
    speed: speed,
    isVisible: true
  };

  enemies.push(enemy);
}

function moveEnemies() {
  enemies.forEach((enemy, index) => {
    if (enemy.isMovingLeft) {
      enemy.x -= enemy.speed;
    } else {
      enemy.x += enemy.speed;
    }

    if (enemy.x < -enemy.width || enemy.x > canvas.width) {
      enemies.splice(index, 1);
    }
  });
}

function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (enemy.isVisible && bullet.x < enemy.x + enemy.width &&
        bullet.x + 5 > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + 10 > enemy.y) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score++;
      }
    });
  });
}

function drawEnemies() {
  ctx.fillStyle = 'green';
  enemies.forEach(enemy => {
    if (enemy.isVisible) {
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}

let score = 0;
let gameTime = 0;
const gameDuration = 1;

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function drawTimer() {
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText('Time: ' + Math.floor(gameTime / 60) + ':' + (gameTime % 60).toString().padStart(2, '0'), 10, 60);
}

function endGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.font = '40px Arial';
  ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
}

function updateTimer() {
  gameTime++;
  // console.log(gameTime);
  // console.log(gameDuration);
  if (gameTime >= gameDuration) {
    endGame();
  }
}

function gameLoop() {
  moveBullets();
  moveEnemies();
  checkCollisions();
  // endGame();
  updateTimer();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawScore();
  drawTimer();

  requestAnimationFrame(gameLoop);
}

gameLoop();

setInterval(spawnRandomEnemy, 5000);
setInterval(spawnMovingEnemy, 3000);
