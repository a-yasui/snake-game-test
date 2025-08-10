const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart');

const tileCount = 35;
const tileSize = canvas.width / tileCount;
const moveTime = 200; // ms per move
const stuckLimit = 1000; // ms before game over when stuck

let snake = [];
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let moveInterval;
let stuckTime = 0;

function updateScoreDisplay() {
  const scoreEl = document.getElementById('score');
  scoreEl.innerHTML =
    '<span class="text-red-600 font-extrabold">+~~ !! </span>' +
    score +
    ' Score';
  setTimeout(() => {
    scoreEl.textContent = 'Score: ' + score;
  }, 800);
}

function highlightButton(id) {
  const btn = document.getElementById(id);
  btn.classList.add('bg-blue-500', 'text-white');
  setTimeout(() => btn.classList.remove('bg-blue-500', 'text-white'), 200);
}

function initGame() {
  restartBtn.style.display = 'none';
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

  placeFood();
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
  } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
  food = newFood;
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
    head.y >= tileCount ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    stuckTime += moveTime;
    if (stuckTime >= stuckLimit) {
      gameOver();
    }
    return;
  }

  stuckTime = 0;
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    updateScoreDisplay();
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

  ctx.fillStyle = 'lime';
  snake.forEach(seg => {
    ctx.fillRect(seg.x * tileSize, seg.y * tileSize, tileSize, tileSize);
  });
}

function gameOver() {
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
