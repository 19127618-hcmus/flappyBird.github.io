var myGamePiece;
var myObstacles = [];
var myGift = [];
var myPrank = [];
var myScore;
var score = 0;
var speed = 1;
const birtWidth = 40;
const birtHeight = 40;
const tubeWidth = 40;
const tubeHeight = 40;

function startGame() {
    myGamePiece = new component(birtWidth, birtHeight, "static/images/penguinFly1.png", 40, 200, "image");
    myScore = new component("30px", "Consolas", "black", 400, 40, "text");
    myGameArea.start();
    lastScoreIncreaseTime = Date.now();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.canvas.id = ("canvas-game")
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);

    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    },

}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type == "image") {
            ctx.drawImage(this.image,
                this.x, this.y, this.width, this.height)
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    this.crashWith = function (otherObject) {
        var myLeft = this.x;
        var myRight = this.x + this.width;
        var myTop = this.y;
        var myBottom = this.y + this.height;

        var otherObjectLeft = otherObject.x;
        var otherObjectRight = otherObject.x + otherObject.width;
        var otherObjectTop = otherObject.y;
        var otherObjectBottom = otherObject.y + otherObject.height;

        var crash = true;
        if (myBottom < otherObjectTop + 2 || myTop > otherObjectBottom - 5 || myRight < otherObjectLeft + 2 || myLeft > otherObjectRight - 5) {
            crash = false;
        }
        return crash;

    }
}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}
function createObject(speed) {
    if (myGameArea.frameNo == 1 || everyinterval(250)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = tubeHeight;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

        // myObstacles.push(new component(tubeWidth, x - height - gap, "green", x, height + gap))
        // myObstacles.push(new component(tubeWidth, height, "green", x, 0));
        var areaHeight = myGameArea.canvas.height;
        myObstacles.push(new component(tubeWidth, tubeHeight, "static/images/whale1.png", (x + Math.floor((Math.random() * 30))), (Math.floor(Math.random() * (areaHeight / 3) + 1)), "image"))
        myObstacles.push(new component(tubeWidth, tubeHeight, "static/images/whale1.png", (x + Math.floor((Math.random() * 30))), (Math.floor(Math.random() * ((areaHeight / 3) * 2 - areaHeight / 3 + 1) + areaHeight / 3)), "image"));
        myObstacles.push(new component(tubeWidth, tubeHeight, "static/images/whale1.png", (x + Math.floor((Math.random() * 30))), (Math.floor(Math.random() * (areaHeight - areaHeight / 3 * 2 - 15) + areaHeight / 3 * 2 - 15)), "image"));
        myGift.push(new component(tubeWidth, tubeHeight, "static/images/fist1.png", (Math.floor(Math.random() * (x - x / 2 + 1) + x / 2)), (Math.floor(Math.random() * (areaHeight) + 1)), "image"))
        myPrank.push(new component(tubeWidth, tubeHeight, "static/images/penguinBull1.png", (Math.floor(Math.random() * (x - x / 2 + 1) + x / 2)), (Math.floor(Math.random() * (areaHeight) + 1)), "image"))
    }

    createObstacle(myObstacles, speed);
    createObstacle(myGift, 1);
    createObstacle(myPrank, 1);

}

function createObstacle(Obstacle, speed) {
    console.log(speed)
    for (i = 0; i < Obstacle.length; i++) {
        Obstacle[i].speedX = -speed;
        Obstacle[i].newPos();
        Obstacle[i].update();
    }
}

function updateGameArea() {

    for (i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGamePiece.image.src = "static/images/penguinSit1.png";
            setTimeout(function () {
                myGameArea.stop();
                return;
            }, 50)
        }
    }

    for (i = 0; i < myGift.length; i++) {
        if (myGamePiece.crashWith(myGift[i])) {
            score += 100;
            myGift.splice(i, 1);
            speed -= 0.1;
            break; 
        }
    }
    for (i = 0; i < myPrank.length; i++) {
        if (myGamePiece.crashWith(myPrank[i])) {
            score += 150;
            myPrank.splice(i, 1);
            speed += 0.2;
            break; 
        }
    }

    myGameArea.clear();
    myGameArea.frameNo++;

    
    var currentTime = Date.now();
    if (currentTime - lastScoreIncreaseTime >= 10000) { // 10 giây
        score += 100;
        speed += 0.1;
        lastScoreIncreaseTime = currentTime;
    }
    createObject(speed)
    // myScore.text = "Score: " + myGameArea.frameNo;
    myScore.text = "Score: " + score;
    myScore.update();

    myGamePiece.newPos();
    myGamePiece.update();
}



function move(dir) {
    myGamePiece.image.src = "static/images/penguinFly2.png";
    switch (dir) {
        case "up":
            myGamePiece.speedY = -2;
            break;
        case "down":
            myGamePiece.speedY = 2;
        //     break;
        // case "left":
        //     myGamePiece.speedX = -2;
        //     break;
        // case "right":
        //     myGamePiece.speedX = 2;
    }
}

function clearMove() {
    myGamePiece.image.src = "static/images/penguinFly1.png";
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}
