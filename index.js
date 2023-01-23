const bar = document.getElementById("bar");
const ball = document.getElementById("ball");
const body = document.getElementById("body");
let ballRefreshInterval = null;
let ballDirectionX = -1;
let ballDirectionY = -1;
let gameStarted = false;
const gameSpeed = 10;
let gameBlocks = [];

body.addEventListener("mousemove", moveBar)
body.addEventListener("click", () => {

    if(!gameStarted) {
        ballRefreshInterval = setInterval(moveBall, 20);
    }

    gameStarted = true;
})

function randomColor() {
    return `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}`
}

function generateBlocks() {
    const blockSize = 50;
    const space = 10;
    const blockClass = "gameBlock";

    for(let i = 0; i < (window.innerWidth / (blockSize + space)); i++) {
        for(let j = 0; j < window.innerHeight / 3 / (blockSize + space); j++){
            let div = document.createElement("div");
            div.style.position = "absolute";
            div.style.top = `${space + space * j + blockSize * j}px`
            div.style.left = `${space + space * i + blockSize * i}px`
            div.style.width = `${blockSize}px`
            div.style.height = `${blockSize}px`
            div.style.backgroundColor = randomColor();
            div.className = blockClass;
            div.id = `i${i}j${j}`
            body.appendChild(div);
        }
    }
    gameBlocks = Array.from(document.getElementsByClassName(blockClass));
}

generateBlocks()

function moveBar(event) {
    bar.style.left = `${event.x - (bar.offsetWidth / 2)}px`

    if(!gameStarted) {
        const bounds = bar.getBoundingClientRect();
        ball.style.left = `${bounds.x}px`
        ball.style.top = `${bounds.y}px`
    }
}

function  moveBall() {

    const bounds = ball.getBoundingClientRect();
    if(bounds.x <= 0 || bounds.right >= window.innerWidth) {
        ballDirectionX *= -1;
    }
    if(bounds.y <= 0) {
        ballDirectionY *= -1;
    }
    if (bounds.bottom >= window.innerHeight) {
        gameOver();
    }

    const barBounds = bar.getBoundingClientRect()
    if(bounds.bottom >= window.innerHeight - bar.offsetHeight &&
        bounds.left > barBounds.left && bounds.right < barBounds.right
    ) {
        ballDirectionY*= -1;
    }

    gameBlocks.forEach((block, index) => {
        const blockBounds = block.getBoundingClientRect()
        const xCenter = bounds.x + bounds.width / 2;
        const yCenter = bounds.y + bounds.height / 2;

        if(bounds.right > blockBounds.left && bounds.left < blockBounds.left &&
            yCenter > blockBounds.top && yCenter < blockBounds.bottom
        ) {
            block.remove();
            ballDirectionX *= -1;
            gameBlocks = gameBlocks.slice(0, index).concat(gameBlocks.slice(index + 1))
            return;
        }
        if(bounds.left < blockBounds.right && bounds.right > blockBounds.right &&
            yCenter > blockBounds.top && yCenter < blockBounds.bottom
        ) {
            block.remove();
            ballDirectionX *= -1;
            gameBlocks = gameBlocks.slice(0, index).concat(gameBlocks.slice(index + 1))
            return;
        }
        if(bounds.bottom > blockBounds.top && bounds.top < blockBounds.top &&
            xCenter > blockBounds.left && xCenter < blockBounds.right
        ) {
            block.remove();
            ballDirectionY *= -1;
            gameBlocks = gameBlocks.slice(0, index).concat(gameBlocks.slice(index + 1))
            return;
        }
        if(bounds.top < blockBounds.bottom && bounds.bottom > blockBounds.bottom &&
            xCenter > blockBounds.left && xCenter < blockBounds.right
        ) {
            block.remove();
            ballDirectionY *= -1;
            gameBlocks = gameBlocks.slice(0, index).concat(gameBlocks.slice(index + 1))
        }
    })

    if(gameBlocks.length === 0) {
        gameOver(true)
    }

    ball.style.left = `${Number.parseInt(ball.style.left) + ballDirectionX * gameSpeed}px`
    ball.style.top = `${Number.parseInt(ball.style.top) + ballDirectionY * gameSpeed}px`

}
function gameOver(victory) {
    gameStarted = false
    ballDirectionX = -1;
    ballDirectionY = -1;

    gameBlocks.forEach(block => block.remove());
    generateBlocks();

    clearInterval(ballRefreshInterval);
    if(victory) {
        alert("Victory!");
    } else {
        alert("Game Over!")
    }
}