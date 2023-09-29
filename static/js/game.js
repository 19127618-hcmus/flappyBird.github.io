var myGamePiece;
var myObstacles = [];
var myBackground;
var myGift = [];
var myPrank = [];
var myScore;
var score = 0;
var speed = 1;

var eatSound;
var awSound;

const birtWidth = 46;
const birtHeight = 46;
const tubeWidth = 60;
const tubeHeight = 60;
const optimizeGiftSize = 35;

function startGame() {
    myBackground = new component(1200, 640, "static/images/sea3.png", 0, 0, "background");
    myGamePiece = new component(birtWidth, birtHeight, "static/images/penguinFly1.png", 40, 200, "image");
    myScore = new component("30px", "Consolas", "black", 400, 40, "text");
    eatSound = new sound("static/sound/eating.MP3");
    awSound = new sound("static/sound/aww.MP3");
    myGameArea.start();
    lastScoreIncreaseTime = Date.now();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 960;
        this.canvas.height = 480;
        this.canvas.id = ("canvas-game")
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
            myGamePiece.image.src = "static/images/penguinFly2.png";
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");       
            clearMove()     
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    },

}

function component(width, height, color, x, y, type, speed) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.speedType = speed;
    this.update = function () {
        ctx = myGameArea.context;
        if (type == "background") {
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        } 
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "image" || type == "background") {
            ctx.drawImage(this.image,
                this.x, this.y, this.width, this.height)
        }else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.height > myGameArea.canvas.height) {
            this.y = myGameArea.canvas.height - this.height;
        }
        if (this.type == "background") {
            if (this.x == -(this.width)) { this.x = 0 }
        }
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
    density = 250 - parseInt(speed * speed * 3);
    if (density <= 50) { density = 50; }
    console.log(speed)
    console.log(density)
    if (myGameArea.frameNo == 1 || everyinterval(density)) {
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
        for (i = 0; i < parseInt(speed / 2); i++) {
            if (i == 1) {
                myObstacles.push(new component(tubeWidth, tubeHeight, "static/images/whale2.png", (Math.floor(Math.random() * (x - x / 2 + 1) + x / 2)), (Math.floor(Math.random() * (areaHeight) + 1)), "image", "none"));
            }
        }
        if (density % 20 == 0) {
            myObstacles.push(new component(tubeWidth, tubeHeight, "static/images/whale2.png", (Math.floor(Math.random() * (x - x / 2 + 1) + x / 2)), (Math.floor(Math.random() * (areaHeight) + 1)), "image", "fast"));
        }
        myObstacles.push(new component(tubeWidth, tubeHeight, "static/images/whale2.png", (x + Math.floor((Math.random() * 30))), (Math.floor(Math.random() * (areaHeight / 3) + 1)), "image"));
        myObstacles.push(new component(tubeWidth, tubeHeight, "static/images/whale2.png", (x + Math.floor((Math.random() * 30))), (Math.floor(Math.random() * ((areaHeight / 3) * 2 - areaHeight / 3 + 1) + areaHeight / 3)), "image", "speed"));
        myObstacles.push(new component(tubeWidth, tubeHeight, "static/images/whale2.png", (x + Math.floor((Math.random() * 30))), (Math.floor(Math.random() * (areaHeight - areaHeight / 3 * 2 - 15) + areaHeight / 3 * 2 - 15)), "image", "speed"));
        myGift.push(new component(tubeWidth, tubeHeight-optimizeGiftSize, "static/images/fish2.png", (Math.floor(Math.random() * (x - x / 2 + 1) + x / 2)), (Math.floor(Math.random() * (areaHeight) + 1)), "image", "speed"));
        myPrank.push(new component(tubeWidth-optimizeGiftSize, tubeHeight-optimizeGiftSize+5, "static/images/penguinBull1.png", (Math.floor(Math.random() * (x - x / 2 + 1) + x / 2)), (Math.floor(Math.random() * (areaHeight) + 1)), "image", "speed"));
    }

    createObstacle(myObstacles, speed);
    createObstacle(myGift, 1);
    createObstacle(myPrank, 1);

}

function createObstacle(Obstacles, speed) {
    for (i = 0; i < Obstacles.length; i++) {
        Obstacles[i].speedX = -speed;
        if (Obstacles[i].speedType == "none") {
            Obstacles[i].speedX = -1;
        }
        if (Obstacles[i].speedType == "fast") {
            Obstacles[i].speedX = -speed * 2;
        }
        Obstacles[i].newPos();
        Obstacles[i].update();
    }
}

function updateGameArea() {
    for (i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGamePiece.image.src = "static/images/penguinSit1.png";
            awSound.play();
            // awSound.stop();
            setTimeout(function () {
                myGameArea.stop();
                return;
            }, 50)
        }
    }

    for (i = 0; i < myGift.length; i++) {
        if (myGamePiece.crashWith(myGift[i])) {
            eatSound.play();
            // eatSound.stop();
            score += 100;
            myGift.splice(i, 1);
            speed -= 0.1;
            break;
        }
    }
    for (i = 0; i < myPrank.length; i++) {
        if (myGamePiece.crashWith(myPrank[i])) {
            eatSound.play();
            // eatSound.stop();
            score += 150;
            myPrank.splice(i, 1);
            speed += 0.2;
            break;
        }
    }

    myGameArea.clear();
    myGameArea.frameNo++;

    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();

    var currentTime = Date.now();
    if (currentTime - lastScoreIncreaseTime >= 5000) { // 10 giây
        score += 50;
        speed += 0.1;
        lastScoreIncreaseTime = currentTime;
    }
    createObject(speed)
    // myScore.text = "Score: " + myGameArea.frameNo;
    myScore.text = "Score: " + score;
    myScore.update();

    if(myGameArea.keys && myGameArea.keys[38]){myGamePiece.speedY=-1;}
    if(myGameArea.keys && myGameArea.keys[40]){myGamePiece.speedY=1;}

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

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function () {
        // Check if the audio can be played before attempting to play it
        if (typeof this.sound.play === "function") {
            this.sound.play()
                .catch(function (error) {
                    // Handle any errors that occur during playback
                    console.error("Error playing audio:", error);
                });
        }
    }

    this.stop = function () {
        this.sound.pause();
    }
}