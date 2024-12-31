const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const eatSound = new Audio('assets/eat-sound.mp3');
const gameOverSound = new Audio('assets/game-over.mp3');

let snake = [{ x: 50, y: 50 }];
let food = { x: 200, y: 200 };
let direction = 'RIGHT';
let score = 0;
let gameInterval;
let level = 'normal';
let isGameOver = false;

// Função para desenhar a cobra
function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.beginPath();
        ctx.arc(segment.x + 5, segment.y + 5, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Função para desenhar a comida
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + 5, food.y + 5, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Função para exibir a pontuação dentro do canvas
function displayScore() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';  // Fonte maior
    ctx.fillText(`Pontuação: ${score}`, 10, 40);  // Ajuste de posição para ficar dentro da área do canvas
}

// Função para mover a cobra
function moveSnake() {
    let head = { ...snake[0] };

    switch (direction) {
        case 'UP': head.y -= 10; break;
        case 'DOWN': head.y += 10; break;
        case 'LEFT': head.x -= 10; break;
        case 'RIGHT': head.x += 10; break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        eatSound.play();
        generateFood();
    } else {
        snake.pop();
    }
}

// Função para gerar comida em posições aleatórias
function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
    food.y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
}

// Função para verificar colisões
function checkCollisions() {
    const head = snake[0];

    // Verifica colisão com as extremidades
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // Verifica colisão com o corpo da cobra
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Função para finalizar o jogo
function endGame() {
    clearInterval(gameInterval);
    gameOverSound.play();
    isGameOver = true;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, canvas.height / 3, canvas.width, 100);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 3 + 40);
    ctx.font = '20px Arial';
    ctx.fillText(`Pontuação Final: ${score}`, canvas.width / 2, canvas.height / 3 + 70);
}

// Função para atualizar o jogo
function updateGame() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveSnake();
    drawSnake();
    drawFood();
    displayScore();

    if (checkCollisions()) {
        endGame();
    }
}

// Função para alterar a direção da cobra
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

// Função para iniciar o jogo com um nível
function startGame() {
    snake = [{ x: 50, y: 50 }];
    score = 0;
    direction = 'RIGHT';
    isGameOver = false;
    generateFood();

    clearInterval(gameInterval);
    const speed = level === 'easy' ? 200 : level === 'normal' ? 150 : 100;
    gameInterval = setInterval(updateGame, speed);
}

// Função para selecionar o nível
function setLevel(selectedLevel) {
    level = selectedLevel;
    startGame();
}

// Inicialização
startGame();
