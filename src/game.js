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
        this.completedLevels = new Set();

        // UI Elements
        this.mainMenu = document.getElementById('mainMenu');
        this.levelSelect = document.getElementById('levelSelect');
        this.gameScreen = document.getElementById('gameScreen');
        this.timerElement = document.getElementById('timer');
        this.hitsElement = document.getElementById('hits');
        this.levelGrid = document.getElementById('levelGrid');
        this.levelCompleteOverlay = document.getElementById('levelCompleteOverlay');
        this.levelCompleteTitle = document.getElementById('levelCompleteTitle');
        this.levelNumber = document.getElementById('levelNumber');
        this.replayBtn = document.getElementById('replayBtn');
        this.nextLevelBtn = document.getElementById('nextLevelBtn');
        this.backToLevelsBtn = document.getElementById('backToLevelsBtn');

        // Pause menu elements
        this.pauseButton = document.getElementById('pauseButton');
        this.pauseMenu = document.getElementById('pauseMenu');
        this.resumeBtn = document.getElementById('resumeBtn');
        this.restartLevelBtn = document.getElementById('restartLevelBtn');
        this.levelSelectBtn = document.getElementById('levelSelectBtn');

        // Level info elements
        this.levelNumberElement = document.getElementById('levelNumber');
        this.levelDescriptionElement = document.getElementById('levelDescription');

        // Bind event handlers
        this.replayBtn.addEventListener('click', () => this.restartLevel());
        this.nextLevelBtn.addEventListener('click', () => this.loadNextLevel());
        this.backToLevelsBtn.addEventListener('click', () => this.showLevelSelect());
        document.getElementById('playButton').addEventListener('click', () => this.showLevelSelect());
        document.getElementById('backButton').addEventListener('click', () => this.showMainMenu());

        // Bind pause menu handlers
        this.pauseButton.addEventListener('click', () => this.togglePause());
        this.resumeBtn.addEventListener('click', () => this.togglePause());
        this.restartLevelBtn.addEventListener('click', () => {
            this.togglePause();
            this.restartLevel();
        });
        this.levelSelectBtn.addEventListener('click', () => {
            this.togglePause();
            this.showLevelSelect();
        });

        // Initialize level grid
        this.initializeLevelGrid();

        // Bind the game loop to this instance
        this.gameLoop = this.gameLoop.bind(this);
    }

    async init() {
        try {
            console.log('Initializing game...');
            // Load images first
            await this.renderer.loadImages();
            console.log('Images loaded successfully');
            
            // Show main menu
            this.showMainMenu();
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    showMainMenu() {
        this.mainMenu.style.display = 'flex';
        this.levelSelect.style.display = 'none';
        this.gameScreen.style.display = 'none';
        this.levelCompleteOverlay.style.display = 'none';
        this.stopGameLoop();
    }

    showLevelSelect() {
        this.mainMenu.style.display = 'none';
        this.levelSelect.style.display = 'flex';
        this.gameScreen.style.display = 'none';
        this.levelCompleteOverlay.style.display = 'none';
        this.stopGameLoop();
        
        // Initialize the level grid
        this.initializeLevelGrid();
    }

    showGameScreen() {
        this.mainMenu.style.display = 'none';
        this.levelSelect.style.display = 'none';
        this.gameScreen.style.display = 'block';
        this.pauseButton.style.display = 'block';
        this.timerElement.style.display = 'block';
        this.hitsElement.style.display = 'block';
        this.isPaused = false;
    }

    hideGameScreen() {
        this.gameScreen.style.display = 'none';
        this.pauseButton.style.display = 'none';
        this.timerElement.style.display = 'none';
        this.hitsElement.style.display = 'none';
        this.pauseMenu.classList.remove('visible');
    }

    initializeLevelGrid() {
        // Clear any existing buttons
        this.levelGrid.innerHTML = '';
        
        // Create buttons for each level
        for (let i = 1; i <= 4; i++) {
            const button = document.createElement('button');
            button.className = 'levelButton';
            if (this.completedLevels.has(i)) {
                button.classList.add('completed');
            }
            button.textContent = i;
            button.addEventListener('click', () => this.loadLevel(i));
            this.levelGrid.appendChild(button);
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
            this.levelNumberElement.textContent = `Level ${levelNumber}`;
            this.levelDescriptionElement.textContent = this.level.getDescription();

            // Show game screen
            this.showGameScreen();

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

            // Handle hits display
            if (this.level.getHits() > 0) {
                this.hitsElement.style.display = 'block';
                this.hitsElement.textContent = `Hits: ${this.level.getHits()}`;
            } else {
                this.hitsElement.style.display = 'none';
            }

            // Start the game loop
            this.startGameLoop();
        } catch (error) {
            console.error('Error loading level:', error);
            throw error;
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

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.pauseMenu.classList.add('visible');
            this.stopGameLoop();
        } else {
            this.pauseMenu.classList.remove('visible');
            this.startGameLoop();
        }
    }

    gameLoop(timestamp) {
        if (this.isPaused) return;

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

        // Update hits display if level has hits
        if (this.level.getHits() > 0) {
            this.hitsElement.textContent = `Hits: ${this.level.getHits()}`;
        } else {
            this.hitsElement.style.display = 'none';
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
        // Stop the game loop first
        this.stopGameLoop();
        
        // Mark level as completed
        this.completedLevels.add(this.currentLevel);
        
        // Update UI
        this.levelCompleteTitle.textContent = 'Level Complete!';
        this.levelNumber.textContent = `Level ${this.currentLevel}`;
        this.levelCompleteOverlay.classList.remove('failed');
        this.levelCompleteOverlay.style.display = 'flex';
        
        // Show/hide next level button based on whether there is a next level
        this.nextLevelBtn.style.display = this.currentLevel < 4 ? 'inline-block' : 'none';
        
        // Fade in the overlay
        requestAnimationFrame(() => {
            this.levelCompleteOverlay.style.opacity = '1';
        });
    }

    showLevelFailed() {
        // Stop the game loop first
        this.stopGameLoop();
        
        // Update UI
        this.levelCompleteTitle.textContent = 'Time\'s Up!';
        this.levelNumber.textContent = `Level ${this.currentLevel}`;
        this.levelCompleteOverlay.classList.add('failed');
        this.levelCompleteOverlay.style.display = 'flex';
        this.nextLevelBtn.style.display = 'none';
        
        // Fade in the overlay
        requestAnimationFrame(() => {
            this.levelCompleteOverlay.style.opacity = '1';
        });
    }

    restartLevel() {
        // Hide overlay with fade
        this.levelCompleteOverlay.style.opacity = '0';
        setTimeout(() => {
            this.levelCompleteOverlay.style.display = 'none';
            // Reload the current level
            this.loadLevel(this.currentLevel);
        }, 300);
    }

    loadNextLevel() {
        // Hide overlay with fade
        this.levelCompleteOverlay.style.opacity = '0';
        setTimeout(() => {
            this.levelCompleteOverlay.style.display = 'none';
            const nextLevel = this.currentLevel + 1;
            if (nextLevel <= 4) {
                this.loadLevel(nextLevel);
            } else {
                this.showLevelSelect();
            }
        }, 300);
    }
}