class FlappyGoose {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');

        // Game state
        this.gameRunning = false;
        this.score = 0;

        // Goose properties
        this.goose = {
            x: 50,
            y: 300,
            width: 30,
            height: 25,
            velocity: 0,
            gravity: 0.6,
            jump: -12
        };

        // Pipes array
        this.pipes = [];
        this.pipeWidth = 50;
        this.pipeGap = 150;
        this.pipeSpeed = 2;

        // Initialize
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startGame();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.flap();
            }
        });

        // Mouse/touch controls
        this.canvas.addEventListener('click', () => {
            this.flap();
        });
    }

    flap() {
        if (this.gameRunning) {
            this.goose.velocity = this.goose.jump;
        } else {
            this.startGame();
        }
    }

    startGame() {
        this.gameRunning = true;
        this.score = 0;
        this.goose.y = 300;
        this.goose.velocity = 0;
        this.pipes = [];
        this.gameOverElement.style.display = 'none';
        this.updateScore();
        this.gameLoop();
    }

    gameLoop() {
        if (!this.gameRunning) return;

        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Update goose physics
        this.goose.velocity += this.goose.gravity;
        this.goose.y += this.goose.velocity;

        // Generate pipes
        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvas.width - 200) {
            this.generatePipe();
        }

        // Update pipes
        this.pipes.forEach(pipe => {
            pipe.x -= this.pipeSpeed;
        });

        // Remove off-screen pipes and update score
        this.pipes = this.pipes.filter(pipe => {
            if (pipe.x + this.pipeWidth < 0) {
                this.score++;
                this.updateScore();
                return false;
            }
            return true;
        });

        // Check collisions
        this.checkCollisions();
    }

    generatePipe() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.pipeGap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

        this.pipes.push({
            x: this.canvas.width,
            topHeight: topHeight,
            bottomY: topHeight + this.pipeGap
        });
    }

    checkCollisions() {
        // Check boundaries
        if (this.goose.y <= 0 || this.goose.y + this.goose.height >= this.canvas.height) {
            this.gameOver();
            return;
        }

        // Check pipe collisions
        this.pipes.forEach(pipe => {
            if (this.goose.x < pipe.x + this.pipeWidth &&
                this.goose.x + this.goose.width > pipe.x) {

                if (this.goose.y < pipe.topHeight ||
                    this.goose.y + this.goose.height > pipe.bottomY) {
                    this.gameOver();
                }
            }
        });
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw pipes
        this.ctx.fillStyle = '#228B22';
        this.pipes.forEach(pipe => {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            // Bottom pipe
            this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);
        });

        // Draw goose
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(this.goose.x, this.goose.y, this.goose.width, this.goose.height);

        // Draw goose details (simple)
        this.ctx.fillStyle = '#FF8C00';
        this.ctx.fillRect(this.goose.x + this.goose.width - 5, this.goose.y + 10, 8, 5); // Beak

        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(this.goose.x + 20, this.goose.y + 5, 3, 3); // Eye
    }

    updateScore() {
        this.scoreElement.textContent = `Score: ${this.score}`;
    }

    gameOver() {
        this.gameRunning = false;
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'block';
    }
}

function restartGame() {
    game.startGame();
}

// Start the game
const game = new FlappyGoose();