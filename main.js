const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


// Variables
let score;
let scoreText;
let scoreToWin = 2000;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let isGameRunning = true;
let keys = {};

// Event Listeners

document.addEventListener('keydown', function(e) {
    keys[e.code] = true;
});

document.addEventListener('keyup', function(e) {
    keys[e.code] = false;
})

class Player {
    constructor(x, y, radius, startAngle, endAngle) {
        this.x = x;
        this.y = y;
        this.r = radius;
        this.sa = startAngle;
        this.ea = endAngle;


        this.dy = 0;
        this.jumpForce = 15;
        this.originalHeight = radius;
        this.grounded = false;
        this.jumpTimer = 0;
    }

    Animate() {
        //Jump

        if (keys['Space'] || keys['KeyW']) {
            this.Jump();
        } else {
            this.jumpTimer = 0;
        }

        this.y += this.dy;

        //Gravity
        if (this.y + this.r < canvas.height) {
            this.dy += gravity;
            this.grounded = false;
        } else {
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.r;
        }



        this.Draw()
    }

    Draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, this.sa, this.ea)
        ctx.fill();
        ctx.closePath();
    }

    Jump() {
        if (this.grounded && this.jumpTimer == 0) {
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
            this.jumpTimer++;
            this.dy = -this.jumpForce - (this.jumpTimer / 50);
        }
    }
}

class Obstacle {
    constructor(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;

        this.dx = -gameSpeed;
    }

    Update() {
        this.x += this.dx;
        this.Draw();
        this.dx = -gameSpeed;
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStye = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h)
        ctx.closePath();
    }
}

class Text {
    constructor(t, x, y, a, c, s) {
        this.t = t;
        this.x = x;
        this.y = y;
        this.a = a;
        this.c = c;
        this.s = s;
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.font = this.s + "px sans-serif";
        ctx.textAlign = this.a;
        ctx.fillText(this.t, this.x, this.y)
        ctx.closePath();
    }
}

//Create enemy
function SpawnObstacle() {
    let size = RandomInt(20, 70)
    let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4')
    obstacles.push(obstacle)

}
SpawnObstacle();

function RandomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function Start() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.font = "20px sans-serif";

    gameSpeed = 3;
    gravity = 1;

    score = 0;

    player = new Player(75, 0, 50, 0, 2 * Math.PI);
    scoreText = new Text("Score: " + score, 50, 50, 'left', '#212121', '20');
    endGameText = new Text('Game Over', window.innerWidth / 2, window.innerHeight / 2, 'center', '#212121', '50');
    descriptionText = new Text('Score to win: ' + scoreToWin, window.innerWidth - 50, 50, 'right', '#212121', '20');
    controlText = new Text('Press "space" to jump', window.innerWidth - 50, 70, 'right', '#212121', '20')
    winText = new Text('You are a winner!!!', window.innerWidth / 2, window.innerHeight / 2, 'center', '#212121', '50');
    requestAnimationFrame(Update)
}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;



function Update() {
    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spawnTimer--;
    if (spawnTimer <= 0) {
        SpawnObstacle();
        spawnTimer = initialSpawnTimer - gameSpeed * 8;
        if (spawnTimer < 60) {
            spawnTimer = 60;
        }
    }

    //Spawn Enemy
    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];

        if (o.x + o.w < 0) {
            obstacles.splice(i, 1);
        }

        if (player.x < o.x + o.w && player.x + player.r > o.x && player.y < o.y + o.h && player.y + player.r > o.y) {
            isGameRunning = false;
            break;
            // obstacles = []
            // score = 0;
            // spawnTimer = initialSpawnTimer;
            // gameSpeed = 3
        }

        o.Update();
    }
    if (isGameRunning == false) {
        endGameText.Draw();
        return;
    }

    if (score > scoreToWin) {
        obstacles = [];
        winText.Draw();
        return;
    }
    score++;
    scoreText.t = 'Score: ' + score;
    scoreText.Draw();
    descriptionText.Draw();
    controlText.Draw();
    player.Animate();
    gameSpeed += 0.002;
}

Start();