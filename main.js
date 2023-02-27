// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const insideW = width * .33;
const insideH = height * .33;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

let nballs = 0;
let droids = "Remaining Droids:";


class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }   
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = 'rgb(255,255,255)';
    this.size = 10;
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if ((this.x + this.size) >= width) {
      this.x = (this.x - this.size);
    }
  
    if ((this.x - this.size) <= 0) {
      this.x = (this.x + this.size);
    }
  
    if ((this.y + this.size) >= height) {
      this.y = (this.y - this.size);
    }
  
    if ((this.y - this.size) <= 0) {
      this.y = (this.y + this.size);
    } 
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + ball.size) {
          ball.exists = false;
          nballs -= 1;
          droids = `Remaining Droids: ${nballs}`;
          if (nballs === 0) {
            droids = 'GAME OVER: You have defeated the dark side!';
          } 
        }  
      }
    }
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
  
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    // inside rectangle

    if ((this.x + this.size) >= insideW && (this.x - this.size) <= (insideW * 2) && (this.y - this.size) <= ((insideH * 2) - 2) && (this.y + this.size) >= (insideH + 2)) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= insideH && (this.y - this.size) <= (insideH * 2) && (this.x - this.size) <= ((insideW * 2) - 2) && (this.x + this.size) >= (insideW + 2)) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
  }
 
  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }  
   
}

const balls = [];

while (balls.length < 6) {
  const size = 10;
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    x = width - (size * 2),
    y = size * 2,
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
  nballs += 1;
  droids = `Remaining Droids: ${nballs}`;
}

const evilCircle = new EvilCircle(random(12, width - 12), random(12, height - 12));

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "white";
  ctx.strokeRect(0, 0, width, height);
  ctx.strokeRect(insideW, insideH, insideW, insideH);
  ctx.fillStyle = "white";
  ctx.font = "2em serif";
  ctx.textAlign = "center";
  ctx.fillText("Omega Factor", insideW * 1.5, insideH * 1.3, insideW);
  ctx.font = "1em serif";
  ctx.fillText(droids, insideW * 1.5, insideH * 1.5, insideW);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

loop();

