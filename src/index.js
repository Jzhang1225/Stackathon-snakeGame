const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const scoreboard = document.querySelector("#score");
const button = document.querySelector("#tryAgain");
const rankings = document.querySelector("#rankings");

import axios from "axios";

async function getScores() {
  const scores = (await axios.get("/scores")).data;
  rankings.innerHTML = "";
  scores.map((score, idx) => {
    rankings.innerHTML += `<li> ${idx + 1}) ${score.score}</li>`;
  });
}
getScores();

button.addEventListener("click", async () => {
  clearInterval(interval);
  interval = setInterval(moveSnake, 150);
  score = 0;
  currentPosition = { x, y };
  snakeBody = [];
  snakeLength = 3;
  direction = "right";
  foodCoordinate = [];
  inGame = true;
  scoreboard.innerHTML = `Your score is ${score}`;
  ctx.fillStyle = "rgb(0,175,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  makeFood();
});

ctx.fillStyle = "rgb(0,175,0)";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let interval = setInterval(moveSnake, 150);

let x = 60,
  y = 60,
  score = 0,
  currentPosition = { x, y },
  gridSize = 30,
  direction = "right",
  snakeBody = [],
  snakeLength = 3,
  foodCoordinate = [],
  inGame = true,
  snake = new Image(),
  food = new Image();

snake.src = "../assets/prof.png";
food.src = "../assets/stanley.jpeg";

scoreboard.innerHTML = `Your score is ${score}`;

async function gameOver() {
  clearInterval(interval);
  inGame = false;
  scoreboard.innerHTML = `Game over! Your score was ${score}. Try again?`;
  await axios.post("/scores", { score });
  const scores = (await axios.get("/scores")).data;

  rankings.innerHTML = "";
  scores.map((score, idx) => {
    rankings.innerHTML += `<li> ${idx + 1}) ${score.score}</li>`;
  });
}

function drawSnake() {
  for (let i = 0; i < snakeBody.length; i++) {
    if (
      snakeBody[i][0] === currentPosition["x"] &&
      snakeBody[i][1] === currentPosition["y"]
    ) {
      gameOver();
    }
  }
  snakeBody.push([currentPosition["x"], currentPosition["y"]]);
  ctx.drawImage(snake, currentPosition["x"], currentPosition["y"]);
  if (snakeBody.length > snakeLength) {
    const itemToRemove = snakeBody.shift();
    ctx.fillStyle = "rgb(0,175,0)";
    ctx.fillRect(itemToRemove[0], itemToRemove[1], gridSize, gridSize);
  }
  if (
    currentPosition["x"] === foodCoordinate[0] &&
    currentPosition["y"] === foodCoordinate[1]
  ) {
    makeFood();
    snakeLength += 1;
    score += 10;
    scoreboard.innerHTML = `Your score is ${score}`;
  }
}

function makeFood() {
  foodCoordinate = [
    Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
  ];

  for (let i = 0; i < snakeBody.length; i++) {
    if (
      snakeBody[i][0] === foodCoordinate[0] &&
      snakeBody[i][1] === foodCoordinate[1]
    ) {
      makeFood();
    }
  }
  ctx.drawImage(food, foodCoordinate[0], foodCoordinate[1]);
}

function moveUp() {
  if (currentPosition["y"] - gridSize >= 0) {
    direction = "up";
    currentPosition["y"] = currentPosition["y"] - gridSize;
    drawSnake();
  } else gameOver();
}
function moveDown() {
  if (currentPosition["y"] + gridSize < canvas.height) {
    direction = "down";
    currentPosition["y"] = currentPosition["y"] + gridSize;
    drawSnake();
  } else gameOver();
}

function moveLeft() {
  if (currentPosition["x"] - gridSize >= 0) {
    direction = "left";
    currentPosition["x"] = currentPosition["x"] - gridSize;
    drawSnake();
  } else gameOver();
}
function moveRight() {
  if (!foodCoordinate.length) makeFood();
  if (currentPosition["x"] + gridSize < canvas.width) {
    direction = "right";
    currentPosition["x"] = currentPosition["x"] + gridSize;
    drawSnake();
  } else gameOver();
}

window.addEventListener("keydown", (event) => {
  const key = event.key;
  if (inGame) {
    switch (key) {
      case "w":
        if (direction !== "down") moveUp();
        break;
      case "s":
        if (direction !== "up") moveDown();
        break;
      case "a":
        if (direction !== "right") moveLeft();
        break;
      case "d":
        if (direction !== "left") moveRight();
        break;
      default:
        break;
    }
  }
});

function moveSnake() {
  switch (direction) {
    case "up":
      moveUp();
      break;
    case "down":
      moveDown();
      break;
    case "left":
      moveLeft();
      break;
    case "right":
      moveRight();
      break;
    default:
      break;
  }
}
