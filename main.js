// variable declarations
// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


// setup counter
const counter = document.querySelector('p');
let ballCount = 0;

// function to update counter
function updateCounter(countElement) {
  text = countElement.textContent;
  countElement.textContent = text.slice(0, text.length - 2) +
    ballCount.toString().padStart(2, "0");
}


// function to generate random number
function random(min,max) {
  const num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}


// define Shape class
class Shape {
  constructor(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }
}


// define Ball class
class Ball extends Shape {
  constructor(x, y, velX, velY, exists, color, size) {
    super(x, y, velX, velY, exists);

    this.color = color;
    this.size = size;
  }

  // method definitions
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

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (let j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' +
          random(0, 255) + ',' + random(0, 255) + ')';
        }
      }
    }
  }
}


// define EvilCircle class
class EvilCircle extends Shape {
  constructor(x, y, velX, velY, exists, color, size) {
    super(x, y, velX, velY, exists);

    this.color = color;
    this.size = size;
  }

  // method definitions
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if ((this.x + this.size) >= width) {
      this.x = -(this.size);
    }

    if ((this.x - this.size) <= 0) {
      this.x = -(this.size);
    }

    if ((this.y + this.size) >= height) {
      this.y = -(this.size);
    }

    if ((this.y - this.size) <= 0) {
      this.y = -(this.size);
    }
  }

    collisionDetect() {
      for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
          const dx = this.x - balls[j].x;
          const dy = this.y - balls[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + balls[j].size) {
            balls[j].exists = false;
            ballCount -= 1;
            updateCounter(counter);
          }
        }
      }
    }

  setControls() {
    let _this = this;
    window.onkeydown = function(e) {
      if (e.key === 'a') {
        _this.x -= _this.velX;
      } else if (e.key === 'd') {
        _this.x += _this.velX;
      } else if (e.key === 'w') {
        _this.y -= _this.velY;
      } else if (e.key === 's') {
        _this.y += _this.velY;
      }
    }
  }
}


// create an array to store the balls
let balls = [];

while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
    size
  );

  balls.push(ball);
}


// instantiate the evilCircle
const evilCircle = new EvilCircle(
  random(10, width - 10),
  random(10, height - 10),
  20,
  20,
  true,
  'white',
  10
);

evilCircle.setControls();


// set ballCount variable and display count
ballCount = balls.length;
counter.textContent += ballCount;


// animation loop
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  requestAnimationFrame(loop);
}


// call the loop function to run the animation
loop();
