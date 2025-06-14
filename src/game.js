class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.level = new Level();
        this.player = new Player();
        this.renderer = new Renderer(this.canvas, this.ctx);
        this.currentLevel = 1;
        this.isGameRunning = false;
        this.isLevelComplete = false;
        this.isLevelFailed = false;
        this.lastFrameTime = 0;
        this.levelStartTime = 0;
        this.animationFrameId = null;
        this.timerElement = document.getElementById('timer');

        // Set up level info display
        this.levelTitle = document.getElementById('levelTitle');
        this.levelDescription = document.getElementById('levelDescription');
        this.levelSelector = document.getElementById('levelSelector');

        // Set up level complete overlay
        this.levelCompleteOverlay = document.getElementById('levelCompleteOverlay');
        this.levelCompleteTitle = document.getElementById('levelCompleteTitle');
        this.levelNumber = document.getElementById('levelNumber');
        this.replayBtn = document.getElementById('replayBtn');
        this.nextLevelBtn = document.getElementById('nextLevelBtn');

        // Bind event handlers
        this.replayBtn.addEventListener('click', () => this.restartLevel());
        this.nextLevelBtn.addEventListener('click', () => this.loadNextLevel());

        // Initialize level selector
        this.initializeLevelSelector();

        // Bind the game loop to this instance
        this.gameLoop = this.gameLoop.bind(this);
    }

    async init() {
        try {
            console.log('Initializing game...');
            // Load images first
            await this.renderer.loadImages();
            console.log('Images loaded successfully');
            
            // Then load the initial level
            await this.loadLevel(this.currentLevel);
            console.log('Initial level loaded');
            
            // Start the game loop
            this.startGameLoop();
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    startGameLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.isGameRunning = true;
        this.lastFrameTime = performance.now();
        this.levelStartTime = performance.now();
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
        console.log('Game loop started');
    }

    stopGameLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.isGameRunning = false;
    }

    initializeLevelSelector() {
        // Create buttons for each level
        for (let i = 1; i <= 3; i++) {
            const button = document.createElement('button');
            button.className = 'levelButton';
            button.textContent = `Level ${i}`;
            button.addEventListener('click', () => this.loadLevel(i));
            this.levelSelector.appendChild(button);
        }
    }

    async loadLevel(levelNumber) {
        try {
            console.log(`Loading level ${levelNumber}...`);
            this.currentLevel = levelNumber;
            await this.level.loadLevel(levelNumber);
            
            // Update player position from level data
            const startPos = this.level.getStartPosition();
            this.player.setPosition(startPos[0], startPos[1]);
            console.log('Player position set to:', startPos);

            // Update level info
            this.updateLevelInfo();
            
            // Update level selector
            this.updateLevelSelector();

            // Reset game state
            this.isLevelComplete = false;
            this.isLevelFailed = false;

            // Handle timer display
            if (this.level.timeLimit > 0) {
                this.timerElement.style.display = 'block';
                this.timerElement.textContent = this.level.timeLimit;
                this.timerElement.classList.remove('warning', 'danger');
            } else {
                this.timerElement.style.display = 'none';
            }

            // Start the game loop
            this.startGameLoop();
        } catch (error) {
            console.error('Error loading level:', error);
            throw error;
        }
    }

    updateLevelInfo() {
        this.levelTitle.textContent = `Level ${this.currentLevel}`;
        this.levelDescription.textContent = this.level.getDescription();
    }

    updateLevelSelector() {
        const buttons = this.levelSelector.getElementsByClassName('levelButton');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.toggle('active', i + 1 === this.currentLevel);
        }
    }

    updateTimerDisplay(timeRemaining) {
        this.timerElement.textContent = Math.ceil(timeRemaining);
        
        // Update timer color based on remaining time
        this.timerElement.classList.remove('warning', 'danger');
        if (timeRemaining <= 3) {
            this.timerElement.classList.add('danger');
        } else if (timeRemaining <= 5) {
            this.timerElement.classList.add('warning');
        }
    }

    gameLoop(timestamp) {
        if (!this.isGameRunning) return;

        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        // Update game state
        this.player.update(this.level);
        
        // Update timer if level has one
        if (this.level.timeLimit > 0) {
            const elapsedTime = (timestamp - this.levelStartTime) / 1000;
            const timeRemaining = Math.max(0, this.level.timeLimit - elapsedTime);
            
            // Update timer display
            this.updateTimerDisplay(timeRemaining);
            
            if (timeRemaining <= 0) {
                this.showLevelFailed();
                return;
            }
        }

        // Check for level completion
        if (this.player.hasReachedOrb(this.level)) {
            this.showLevelComplete();
            return;
        }

        // Render the game
        this.renderer.render(this.level, this.player);

        // Continue the game loop
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }

    showLevelComplete() {
        this.isLevelComplete = true;
        this.stopGameLoop();
        
        this.levelCompleteTitle.textContent = 'Level Complete!';
        this.levelNumber.textContent = `Level ${this.currentLevel}`;
        this.levelCompleteOverlay.classList.remove('failed');
        this.levelCompleteOverlay.style.display = 'flex';
        setTimeout(() => {
            this.levelCompleteOverlay.style.opacity = '1';
        }, 10);
    }

    showLevelFailed() {
        this.isLevelFailed = true;
        this.stopGameLoop();
        
        this.levelCompleteTitle.textContent = 'Time\'s Up!';
        this.levelNumber.textContent = `Level ${this.currentLevel}`;
        this.levelCompleteOverlay.classList.add('failed');
        this.levelCompleteOverlay.style.display = 'flex';
        setTimeout(() => {
            this.levelCompleteOverlay.style.opacity = '1';
        }, 10);
    }

    restartLevel() {
        this.levelCompleteOverlay.style.opacity = '0';
        setTimeout(() => {
            this.levelCompleteOverlay.style.display = 'none';
            this.loadLevel(this.currentLevel);
        }, 300);
    }

    loadNextLevel() {
        this.levelCompleteOverlay.style.opacity = '0';
        setTimeout(() => {
            this.levelCompleteOverlay.style.display = 'none';
            const nextLevel = this.currentLevel + 1;
            if (nextLevel <= 3) {
                this.loadLevel(nextLevel);
            } else {
                // If we're at the last level, loop back to level 1
                this.loadLevel(1);
            }
        }, 300);
    }
}

// Initialize the game when the window loads
window.addEventListener('load', () => {
    const game = new Game();
    game.init();
}); 