const canvas = document.querySelector('canvas'),
    canvasCtx = canvas.getContext('2d');
const gapX = 10;

const mouse = {
    x: 0,
    y: 0
}

const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        canvasCtx.fillStyle = "#286047";
        canvasCtx.fillRect(0, 0, this.w, this.h);
    }
}

const line = {
    w: 15,
    h: field.h,
    draw: function () {
        canvasCtx.fillStyle = "#FFFFFF";
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
    }
}

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function () {
        this.human++
    },
    increaseComputer: function () {
        this.computer++
    },
    draw: function () {
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.fillStyle = "#01341D"
        canvasCtx.fillText(this.human, field.w / 4, 50)
        canvasCtx.fillText(this.computer, field.w / 2 + field.w / 4, 50)
        canvasCtx.textBaseline = "top"
        canvasCtx.textAlign = "center"
    }
}

const leftPaddle = {
    x: gapX,
    y: field.h / 2,
    w: line.w,
    h: 200,
    _move: function () {
        this.y = mouse.y
    },
    draw: function () {
        canvasCtx.fillStyle = "#FFFFFF";
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move()
    }
}

const rightPaddle = {
    x: field.w - line.w - gapX,
    y: field.h / 2,
    w: line.w,
    h: 200,
    speed: 5,
    _move: function () {
        if (this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed
        } else {
            this.y -= this.speed;
            // this.y = ball.y ===> Hack Mode
        }
    },
    speedUp: function () {
        this.speed++
    },
    draw: function () {
        canvasCtx.fillStyle = "#FFFFFF";
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move()
    }
}

const ball = {
    x: field.w / 2,
    y: field.h / 2,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function () {
        if (this.x > field.w - this.r - rightPaddle.w - gapX) {
            if (this.y + this.r > rightPaddle.y && this.y - this.r < rightPaddle.y + rightPaddle.h) {
                this._reverseX()
            } else {
                score.increaseHuman()
                this._pointUp();
            }
        }

        if (this.x < this.r + leftPaddle.w + gapX) {
            if (this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h) {
                this._reverseX()
            } else {
                score.increaseComputer()
                this._pointUp();
            }
        }

        if ((this.y - this.r < 0 && this.directionY < 0) || (this.y > field.h - this.r && this.directionY > 0)) {
            this._reverseY();
        }
    },
    _reverseY: function () {
        this.directionY *= -1;
    },
    _reverseX: function () {
        this.directionX *= -1;
    },
    _speedUp: function () {
        this.speed += 3;
    },
    _pointUp: function () {
        this.x = field.w / 2
        this.y = field.h / 2

        this._reverseX()
        this._speedUp();
        rightPaddle.speedUp()
    },
    _move: function () {
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
    },
    draw: function () {
        canvasCtx.fillStyle = "#FFFFFF";
        canvasCtx.beginPath();
        canvasCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        canvasCtx.fill();

        this._calcPosition();
        this._move();
    }
}

function setup() {
    canvas.width = canvasCtx.width = window.innerWidth;
    canvas.height = canvasCtx.height = window.innerHeight;
}

function draw() {
    field.draw();
    line.draw();
    score.draw();
    leftPaddle.draw();
    rightPaddle.draw();
    ball.draw();
}

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}

setup();
main();

canvas.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX
    mouse.y = e.pageY
})