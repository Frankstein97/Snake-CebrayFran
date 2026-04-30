const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const speedEl = document.getElementById('speed');
const restartBtn = document.getElementById('restart-btn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

const baseSpeed = 140;
const minSpeed = 60;
const speedStep = 5;

let snake;
let direction;
let nextDirection;
let fruit;
let score;
let loopTimeout;
let isGameOver;

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  fruit = randomFruit();
  score = 0;
  isGameOver = false;
  clearTimeout(loopTimeout);
  render();
  updateStats();
  gameLoop();
}

function gameLoop() {
  if (isGameOver) return;

  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (hitWall(head) || hitSelf(head)) {
    isGameOver = true;
    drawGameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === fruit.x && head.y === fruit.y) {
    score += 1;
    fruit = randomFruit();
    updateStats();
  } else {
    snake.pop();
  }

  render();

  const speed = Math.max(minSpeed, baseSpeed - score * speedStep);
  loopTimeout = setTimeout(gameLoop, speed);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fruit
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(fruit.x * gridSize, fruit.y * gridSize, gridSize, gridSize);

  // snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#22c55e' : '#86efac';
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function drawGameOver() {
  render();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f9fafb';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 8);
  ctx.font = '16px Arial';
  ctx.fillText('Press Restart to play again', canvas.width / 2, canvas.height / 2 + 24);
}

function updateStats() {
  scoreEl.textContent = String(score);
  const speedMultiplier = (baseSpeed / Math.max(minSpeed, baseSpeed - score * speedStep)).toFixed(2);
  speedEl.textContent = `${speedMultiplier}x`;
}

function randomFruit() {
  let next;
  do {
    next = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake?.some((segment) => segment.x === next.x && segment.y === next.y));

  return next;
}

function hitWall(head) {
  return head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount;
}

function hitSelf(head) {
  return snake.some((segment) => segment.x === head.x && segment.y === head.y);
}

window.addEventListener('keydown', (event) => {
  const keyMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
  };

  const next = keyMap[event.key];
  if (!next) return;

  if (next.x === -direction.x && next.y === -direction.y) {
    return;
  }

  nextDirection = next;
});

restartBtn.addEventListener('click', startGame);

startGame();
