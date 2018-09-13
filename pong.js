//main game canva
let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
//ball stats
let ballX = 20;
let ballY = 20;
let ballSpeedX = 10;
let ballSpeedY = 4;
//players paddles
let paddlesHeight = 100;
let paddlesWidth = 8;
let paddle1Y = (canvas.height/2) - 50;
let playerX = 15;
let paddle2Y = (canvas.height/2) - 50;
//scores
let playerScore = 0;
let computerScore = 0;
let winningScore = 3;
let gameOver = false;

//initial state
drawGame();
canvas.addEventListener('mousemove', getMousePos);
canvas.addEventListener('click', restartGame);

  setInterval(function() {
      moveGame();
      drawGame();
  },20);

  //functions
function drawNet() {
  for(var i = 0; i < canvas.height; i+= 45) {
    colorRectangle(canvas.width/2 - 1, i, 1, 15, 'grey');
  }
}

  function restartGame() {
    if(gameOver) {
      resetBall();
      gameOver = false;
    }
  }

function resetBall() {
  if(playerScore < winningScore && computerScore < winningScore) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 4;
    ballX = canvas.width/3;
    ballY = canvas.height/3;
  } else {
    if(playerScore == winningScore) {
      winner = 'player1';
    } else {
      winner = 'player2';
    }
    playerScore = 0;
    computerScore = 0;
    ctx.fillStyle = 'white';
    ctx.fillText(winner + ' wins this game, congratulations!', 200, 300);
    ctx.fillText('GAME OVER', canvas.width/2 - 100,200);
    gameOver = true;
  }
}

function computerMovement() {
  if(paddle2Center < ballY - 35) {
    paddle2Y += 8;
  } else if (paddle2Center > ballY + 35){
    paddle2Y -= 8;
  }
}

function moveGame() {
  if(gameOver) {
    return;
  }
    paddle1Center = paddle1Y + (paddlesHeight/2);
    paddle2Center = paddle2Y + (paddlesHeight/2);
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //ball bounces right or left side
    if(ballX >= canvas.width) {
      ballSpeedX = -ballSpeedX;
    }

    //ball bounces on player's paddle or ball reset
    if(ballY > paddle1Y + paddlesHeight || ballY < paddle1Y) {
      if(ballX < 0) {
        computerScore++;
        resetBall();
      }
    } else {
      if(ballX < playerX + paddlesWidth) {
        var deltaY = ballY - paddle1Center;
          ballSpeedX = -ballSpeedX;
          //adjust angle reflection based on ball position on paddle
          ballSpeedY = deltaY * 0.30;
      }
    }

    //ball bounces on opponent's paddle or ball reset
    if(ballY >= paddle2Y + paddlesHeight || ballY <= paddle2Y) {
      if(ballX > canvas.width) {
        playerScore++;
        resetBall();
      }
    } else {
      if(ballX > canvas.width - (15 + paddlesWidth)) {
        var deltaY = ballY - paddle2Center;
          ballSpeedX = -ballSpeedX;
          //adjust angle reflection based on ball position on paddle
          ballSpeedY = deltaY * 0.30;
      }
    }

    //ball bounces top and bottom side
    if(ballY <= 0 || ballY >= canvas.height) {
      ballSpeedY = -ballSpeedY;
    }
}

function drawGame() {
  if(gameOver) {
    return;
  }
  //draw main game
  colorRectangle(0, 0, canvas.width, canvas.height, 'black');

  //draw net
  drawNet();

  //draw players paddles
  colorRectangle(playerX, paddle1Y, paddlesWidth, paddlesHeight, 'white');
  colorRectangle(canvas.width - (15 + paddlesWidth), paddle2Y, paddlesWidth, paddlesHeight, 'white');

  //draw ball
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(ballX,ballY,8,0,2*Math.PI);
  ctx.fill();

  //draw scores
  ctx.fillStyle = 'white';
  ctx.font="20px Verdana";
  ctx.fillText(playerScore, 100,50);
  ctx.fillText(computerScore, canvas.width - 100,50);
}

function colorRectangle(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    //change paddle1 position based on mouse Y position
    paddle1Y = mouseY - paddlesHeight/2;
    // if(mouseX < canvas.width/2 - 1) {
    //   playerX = mouseX;
    // }
}
