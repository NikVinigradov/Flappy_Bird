const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();

const endGame = document.querySelector('.end-game');
const restartBtn = document.querySelector('.restart');
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".best-score");

// получение большего кол-во очков из localStorage

let highScore = localStorage.getItem("best-score") || 0;


bird.src = "images/bird-1.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeUp.src = "images/pipe-Top.png";
pipeBottom.src = "images/pipe-Bottom.png";

// Звуковые файлы
let fly = new Audio();
let score_audio = new Audio();
let die = new Audio()

fly.src = "sound/sfx_wing.mp3";
score_audio.src = "sound/sfx_point.mp3";
die.src = "sound/sfx_die.mp3";


let gap = 90;

// При нажатии на какую-либо кнопку
document.addEventListener("keydown", moveUp);
document.addEventListener("mousedown", moveUp);


function moveUp() {
 yPos -= 25;
 fly.play();
}

// Создание блоков
let pipe = [];

pipe[0] = {
 x : cvs.width,
 y : 0
}

let score = 0;
// Позиция птички
let xPos = 10;
let yPos = 150;
let grav = 1.7;

restartBtn.addEventListener('click', () => {
   endGame.classList.remove('end-game__open')
  restart();
});

function restart () {
   location.reload();
}

let gameEnded = false; // Добовляем флаг состояния игры

function gameOver() {
   endGame.classList.add('end-game__open');
   document.querySelector('.score').innerHTML = score;
   endGame = true;
}


function draw() {

   if(gameEnded) return // Если игра завершена прекращаем обновление экрана
 ctx.drawImage(bg, 0, 0);

 for(let i = 0; i < pipe.length; i++) {
 ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
 ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);

 pipe[i].x--;

 if(pipe[i].x == 125) {
 pipe.push({
 x : cvs.width,
 y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
 });
 }

 // Отслеживание прикосновений
 if(xPos + bird.width >= pipe[i].x
 && xPos <= pipe[i].x + pipeUp.width
 && (yPos <= pipe[i].y + pipeUp.height
 || yPos + bird.height >= pipe[i].y + pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height) {
    gameOver();
    die.play();
 }

 if(pipe[i].x == 5) {
 score++;

 highScore = score >= highScore ? score : highScore; 

 localStorage.setItem("best-score", highScore);
 scoreElement.innerText = `Очки: ${score}`;
 highScoreElement.innerText = `Рекорд: ${highScore}`;

 score_audio.play();
 }
 }

 ctx.drawImage(fg, 0, cvs.height - fg.height);
 ctx.drawImage(bird, xPos, yPos);

 yPos += grav;

 ctx.fillStyle = "#000";
 ctx.font = "24px Verdana";
 ctx.fillText("Счет: " + score, 10, cvs.height - 40);
 ctx.fillText("Рекорд: " + highScore, 10, cvs.height - 20);

 requestAnimationFrame(draw);
}

pipeBottom.onload = draw;


