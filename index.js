const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const playerScoreLabel = document.getElementById("playerScore");
const computerScoreLabel = document.getElementById("computerScore");

class Paddle {
  constructor(x, y) {
    this.width = 10;
    this.height = 75;
    this.x = x;
    this.y = y;
    this.speed = 5;
  }

  draw() {
    context.fillStyle = "white";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  moveUp() {
    if (this.y - this.speed > 0) {
      this.y -= this.speed;
    }
  }

  moveDown() {
    if (this.y + this.height + this.speed < canvas.height) {
      this.y += this.speed;
    }
  }
}

class Ball {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 10;
    this.speedX = 5;
    this.speedY = 5;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = "white";
    context.fill();
    context.closePath();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.speedY = -this.speedY;
    }
  }
}

class Game {
  constructor() {
    this.player = new Paddle(10, canvas.height / 2 - 50);
    this.computer = new Paddle(canvas.width - 20, canvas.height / 2 - 50);
    this.ball = new Ball();
    this.gameStarted = false;
    this.playerScore = 0;
    this.computerScore = 0;
    this.winnerMessage = document.getElementById("winnerMessage");
    this.winningPlayer = document.getElementById("winningPlayer");
    this.restartButton = document.getElementById("restartButton");
  }

  moveComputer() {
    if (this.computer.y + this.computer.height / 2 < this.ball.y) {
      this.computer.moveDown();
    } else if (this.computer.y + this.computer.height / 2 > this.ball.y) {
      this.computer.moveUp();
    }
  }

  drawText(text, x, y, fontSize) {
    context.fillStyle = "white";
    context.font = `${fontSize}px Arial`;
    context.fillText(text, x, y);
  }

  updateGameArea() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.setLineDash([5, 5]);
    context.strokeStyle = "white";
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();

    this.ball.update();
    this.ball.draw();
    this.player.draw();
    this.computer.draw();

    this.moveComputer();

    if (
      this.ball.x - this.ball.radius < this.player.x + this.player.width &&
      this.ball.x + this.ball.radius > this.player.x &&
      this.ball.y > this.player.y &&
      this.ball.y < this.player.y + this.player.height
    ) {
      this.ball.speedX = -this.ball.speedX;
    }

    if (
      this.ball.x + this.ball.radius > this.computer.x &&
      this.ball.x - this.ball.radius < this.computer.x + this.computer.width &&
      this.ball.y > this.computer.y &&
      this.ball.y < this.computer.y + this.computer.height
    ) {
      this.ball.speedX = -this.ball.speedX;
    }

    if (this.ball.x < 0) {
      this.computerScore++;
      this.ball = new Ball();
    } else if (this.ball.x > canvas.width) {
      this.playerScore++;
      this.ball = new Ball();
    }

    playerScoreLabel.textContent = this.playerScore;
    computerScoreLabel.textContent = this.computerScore;

    if (this.playerScore >= 1 || this.computerScore >= 1) {
      this.gameStarted = false;
      this.displayWinner();
      window.cancelAnimationFrame();
    } else {
      this.drawText("Player: " + this.playerScore, 50, 20);
      this.drawText("Computer: " + this.computerScore, canvas.width - 110, 20);
      window.requestAnimationFrame(this.updateGameArea.bind(this));
    }
  }

  displayWinner() {
    this.winnerMessage.style.display = "block";
    if (this.playerScore > this.computerScore) {
      this.winningPlayer.textContent = "Player";
    } else {
      this.winningPlayer.textContent = "Computer";
    }

    this.restartButton.addEventListener("click", () => {
      this.playerScore = 0;
      this.computerScore = 0;
      this.winnerMessage.style.display = "none";
      playerScoreLabel.textContent = this.playerScore;
      computerScoreLabel.textContent = this.computerScore;

      this.ball.x = canvas.width / 2;
      this.ball.y = canvas.height / 2;
      this.ball.speedX = 5;
      this.ball.speedY = 5;

      this.updateGameArea();
    });
  }
  startGame() {
    startButton.addEventListener("click", () => {
      this.playerScore = 0;
      this.computerScore = 0;
      playerScoreLabel.textContent = this.playerScore;

      computerScoreLabel.textContent = this.computerScore;

      this.gameStarted = true;

      startButton.style.display = "none";

      this.ball.x = canvas.width / 2;
      this.ball.y = canvas.height / 2;
      this.ball.speedX = 5;
      this.ball.speedY = 5;

      this.updateGameArea();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        this.player.moveUp();
      }
      if (event.key === "ArrowDown") {
        this.player.moveDown();
      }
    });
  }
}

const game = new Game();
game.startGame();
