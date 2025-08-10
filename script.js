const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart');

const tileCount = 35;
const tileSize = canvas.width / tileCount;
const moveTime = 200; // ms per move
const stuckLimit = 1000; // ms before game over when stuck
const initialFoodCount = 5;
const foodSpawnThreshold = 3;
const maxFoodCount = 8;
const foodSpawnTime = 3000; // ms between new food spawns
const blinkInterval = 100; // ms between snake color changes when flashing

let snake = [];
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let foods = [];
let score = 0;
let moveInterval;
let stuckTime = 0;
let snakeColor = 'lime';
let flashInterval = null;
let foodSpawnInterval = null;

function updateScoreDisplay(points) {
  const scoreEl = document.getElementById('score');
  scoreEl.innerHTML =
    '<span class="text-red-600 font-extrabold">+' + points + '!!</span>';
  setTimeout(() => {
    scoreEl.textContent = 'Score: ' + score;
  }, 800);
}

function highlightButton(id) {
  const btn = document.getElementById(id);
  btn.classList.add('bg-blue-500', 'text-white');
  setTimeout(() => btn.classList.remove('bg-blue-500', 'text-white'), 200);
}

function startFlash(interval = blinkInterval) {
  if (flashInterval) return;
  snakeColor = 'red';
  draw();
  flashInterval = setInterval(() => {
    snakeColor = snakeColor === 'lime' ? 'red' : 'lime';
    draw();
  }, interval);
}

function stopFlash() {
  if (!flashInterval) return;
  clearInterval(flashInterval);
  flashInterval = null;
  snakeColor = 'lime';
}

function startFoodSpawner() {
  if (foodSpawnInterval) return;
  foodSpawnInterval = setInterval(() => {
    if (foods.length < maxFoodCount) {
      placeFood();
      draw();
    }
    if (foods.length >= maxFoodCount) {
      stopFoodSpawner();
    }
  }, foodSpawnTime);
}

function stopFoodSpawner() {
  if (!foodSpawnInterval) return;
  clearInterval(foodSpawnInterval);
  foodSpawnInterval = null;
}

function initGame() {
  restartBtn.style.display = 'none';
  stopFlash();
  stopFoodSpawner();
  score = 0;
  document.getElementById('score').innerText = 'Score: ' + score;
  stuckTime = 0;
  snake = [];
  const startX = Math.floor(tileCount / 2);
  const startY = Math.floor(tileCount / 2);
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];
  direction = dirs[Math.floor(Math.random() * dirs.length)];
  nextDirection = { ...direction };

  for (let i = 0; i < 3; i++) {
    snake.push({
      x: startX - direction.x * i,
      y: startY - direction.y * i
    });
  }

  foods = [];
  for (let i = 0; i < initialFoodCount; i++) {
    placeFood();
  }
  if (moveInterval) clearInterval(moveInterval);
  moveInterval = setInterval(gameLoop, moveTime);
}

function placeFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (
    snake.some(seg => seg.x === newFood.x && seg.y === newFood.y) ||
    foods.some(f => f.x === newFood.x && f.y === newFood.y)
  );
  foods.push(newFood);
}

function setNextDirection(x, y) {
  if (direction.x === -x || direction.y === -y) return false;
  nextDirection = { x, y };
  return true;
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
      if (setNextDirection(0, -1)) highlightButton('up');
      break;
    case 'ArrowDown':
      if (setNextDirection(0, 1)) highlightButton('down');
      break;
    case 'ArrowLeft':
      if (setNextDirection(-1, 0)) highlightButton('left');
      break;
    case 'ArrowRight':
      if (setNextDirection(1, 0)) highlightButton('right');
      break;
  }
});

function addControl(id, x, y) {
  const btn = document.getElementById(id);
  const handler = e => {
    e.preventDefault();
    if (setNextDirection(x, y)) highlightButton(id);
  };
  btn.addEventListener('touchstart', handler);
  btn.addEventListener('click', handler);
}

restartBtn.addEventListener('click', initGame);
addControl('up', 0, -1);
addControl('down', 0, 1);
addControl('left', -1, 0);
addControl('right', 1, 0);

function gameLoop() {
  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= tileCount ||
    head.y >= tileCount
  ) {
    stuckTime += moveTime;
    startFlash();
    if (stuckTime >= stuckLimit) {
      gameOver();
    }
    return;
  }

  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    stuckTime += moveTime;
    startFlash();
    if (stuckTime >= stuckLimit) {
      gameOver();
    }
    return;
  }

  stopFlash();
  stuckTime = 0;
  snake.unshift(head);

  const foodIndex = foods.findIndex(f => f.x === head.x && f.y === head.y);
  if (foodIndex !== -1) {
    score += 10;
    updateScoreDisplay(10);
    foods.splice(foodIndex, 1);
    if (foods.length <= foodSpawnThreshold) {
      startFoodSpawner();
    }
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'red';
  foods.forEach(f => {
    ctx.fillRect(f.x * tileSize, f.y * tileSize, tileSize, tileSize);
  });

  ctx.fillStyle = snakeColor;
  snake.forEach(seg => {
    ctx.fillRect(seg.x * tileSize, seg.y * tileSize, tileSize, tileSize);
  });

  const head = snake[0];
  const arrow =
    direction.x === 1
      ? '▶'
      : direction.x === -1
      ? '◀'
      : direction.y === 1
      ? '▼'
      : '▲';
  ctx.fillStyle = 'white';
  ctx.font = `${tileSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    arrow,
    head.x * tileSize + tileSize / 2,
    head.y * tileSize + tileSize / 2
  );
}

function gameOver() {
  stopFlash();
  stopFoodSpawner();
  clearInterval(moveInterval);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  restartBtn.style.display = 'block';
}

initGame();
