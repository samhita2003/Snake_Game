const ele  = document.querySelector(".game-board");
const startBtn = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGame = document.querySelector(".start-game");
const resetGame = document.querySelector(".reset-game");
const resetBtn = document.querySelectorAll(".btn-reset");
const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");
const timeUpGame = document.querySelector(".time-up");
const width = 40;
const height = 40;
let highScore = Number(localStorage.getItem("highScore")) || 0;
let score = 0;
let time = `00-00`;
let interval = null
let timeInterval = null
highScoreElement.innerText = `High Score : ${highScore}`

const cols = Math.floor(ele.clientWidth / width);
const rows = Math.floor(ele.clientHeight / height);
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols)
}

const blocks = []

let snake = [
  {
    x:1,
    y:4
  }]

let direction = 'left'

for(let row = 0;row<rows;row++){
  for(let col = 0;col<cols;col++){
    const div = document.createElement("div");
    div.classList.add("block");
    ele.appendChild(div);
    blocks[`${row}-${col}`] = div
  }
}

function renderSnake(){
  snake.forEach((item)=>{
    blocks[`${item.x}-${item.y}`].classList.add("fill")
  })
  blocks[`${food.x}-${food.y}`].classList.add("food")

  let head = null
  if (direction == 'left') {
    head = {x:snake[0].x,y:snake[0].y-1}
  }
  else if (direction == 'right') {
    head = {x:snake[0].x,y:snake[0].y+1}
  }
  else if (direction == 'up') {
    head = {x:snake[0].x-1,y:snake[0].y}
  }
  else if (direction == 'down') {
    head = {x:snake[0].x+1,y:snake[0].y}
  }

  if (head.x<0 || head.x>=rows || head.y<0 || head.y>=cols) {
    clearInterval(interval)
    clearInterval(timeInterval)
    modal.style.display = "flex"
    startGame.style.display = "none"
    resetGame.style.display = "flex"
    return
  }
  
  let [min,sec] = time.split("-").map(Number)
  if (min == 0 && sec == 10) {
    clearInterval(interval)
    clearInterval(timeInterval)
    modal.style.display = "flex"
    startGame.style.display = "none"
    resetGame.style.display = "none"
    timeUpGame.style.display = "flex"
    return
  }

  snake.forEach((item)=>{
    blocks[`${item.x}-${item.y}`].classList.remove("fill")
})

if (head.x == food.x && head.y == food.y) {

    // Remove old food
    blocks[`${food.x}-${food.y}`].classList.remove("food")

    // Generate new food
    do {
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    }
} while (
    snake.some(item => item.x == food.x && item.y == food.y)
)

    snake.unshift(head)

    score++
    scoreElement.innerText = `Score : ${score}`

    if (score > highScore) {
        highScore = score
        localStorage.setItem("highScore", highScore.toString())
        highScoreElement.innerText = `High Score : ${highScore}`
    }

}
else {

    snake.unshift(head)
    snake.pop()

}
snake.forEach((item)=>{
    blocks[`${item.x}-${item.y}`].classList.add("fill")
})
}




startBtn.addEventListener("click",()=>{
  modal.style.display = "none"
  clearInterval(interval);
  clearInterval(timeInterval);
  interval = setInterval(() => {
    renderSnake();
  },300)
  timeInterval = setInterval(() => {
    let [min,sec] = time.split("-").map(Number)
    if (sec == 59) {
      min++
      sec = 0
    }
    else{
      sec++
    }
    time = `${min}-${sec}`
    timeElement.innerText = `Time : ${time}`
  },1000);
})

resetBtn.forEach((item)=>{
  item.addEventListener("click",restartGame)
})



function restartGame(){
  clearInterval(interval)
  clearInterval(timeInterval)
  blocks[`${food.x}-${food.y}`].classList.remove("food")
  snake.forEach((item)=>{
    blocks[`${item.x}-${item.y}`].classList.remove("fill")
  })
  score = 0
  time = `00-00`
  scoreElement.innerText = `Score : ${score}`
  timeElement.innerText = `Time : ${time}`
  highScoreElement.innerText = `High Score : ${highScore}`
  modal.style.display = "none"
  direction = 'down'
  snake = [
  {
    x:1,
    y:4
  }]
  food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols)
    }
  interval = setInterval(() => {
    renderSnake();
  },300)
  timeInterval = setInterval(() => {

    let [min,sec] = time.split("-").map(Number)

    if(sec == 59){
        min++
        sec = 0
    }
    else{
        sec++
    }

    time = `${min}-${sec}`

    timeElement.innerText = `Time : ${time}`

},1000)
}



addEventListener("keydown", (e) => {
  if (e.key == 'ArrowUp' && direction != 'down') {
  direction = 'up'
}
else if (e.key == 'ArrowDown' && direction != 'up') {
  direction = 'down'
}
else if (e.key == 'ArrowLeft' && direction != 'right') {
  direction = 'left'
}
else if (e.key == 'ArrowRight' && direction != 'left') {
  direction = 'right'
}
})
