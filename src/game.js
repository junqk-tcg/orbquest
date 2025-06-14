class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.renderer = new Renderer(this.canvas);
        this.level = new Level();
        this.player = null;
        this.currentLevel = 1;
        this.isGameRunning = false;
        this.animationFrameId = null;
        this.totalLevels = 3; // Total number of levels
        
        // Level info elements
        this.levelTitle = document.getElementById('levelTitle');
        this.levelDescription = document.getElementById('levelDescription');
        this.levelSelector = document.getElementById('levelSelector');
        
        // Initialize level selector
        this.initializeLevelSelector();
        
        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
        this.handleLevelComplete = this.handleLevelComplete.bind(this);
        this.handleLevelFailed = this.handleLevelFailed.bind(this);
    }

    initializeLevelSelector() {
        // Clear existing buttons
        this.levelSelector.innerHTML = '';
        
        // Create buttons for each level
        for (let i = 1; i <= this.totalLevels; i++) {
            const button = document.createElement('button');
            button.className = 'levelButton';
            button.textContent = `Level ${i}`;
            button.dataset.level = i;
            
            // Add click handler
            button.addEventListener('click', () => {
                this.loadSpecificLevel(i);
            });
            
            this.levelSelector.appendChild(button);
        }
    }

    async loadSpecificLevel(levelNumber) {
        if (levelNumber < 1 || levelNumber > this.totalLevels) {
            console.error('Invalid level number');
            return;
        }

        // Stop current game loop
        this.stopGameLoop();
        
        // Update current level
        this.currentLevel = levelNumber;
        
        // Load the level
        const success = await this.loadLevel(levelNumber);
        if (!success) {
            console.error('Failed to load level');
            return;
        }
        
        // Update active button
        this.updateActiveLevelButton();
        
        // Start game loop
        this.startGameLoop();
    }

    updateActiveLevelButton() {
        // Remove active class from all buttons
        const buttons = this.levelSelector.getElementsByClassName('levelButton');
        Array.from(buttons).forEach(button => {
            button.classList.remove('active');
        });
        
        // Add active class to current level button
        const activeButton = this.levelSelector.querySelector(`[data-level="${this.currentLevel}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    async init() {
        try {
            console.log('Initializing game...');
            await this.renderer.loadImages();
            await this.loadLevel(this.currentLevel);
            this.updateActiveLevelButton();
            this.startGameLoop();
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    startGameLoop() {
        if (!this.isGameRunning) {
            console.log('Starting game loop');
            this.isGameRunning = true;
            this.gameLoop();
        }
    }

    stopGameLoop() {
        if (this.isGameRunning) {
            console.log('Stopping game loop');
            this.isGameRunning = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }
    }

    async loadLevel(levelNumber) {
        try {
            console.log(`Loading level ${levelNumber}...`);
            const success = await this.level.loadLevel(levelNumber);
            if (!success) {
                throw new Error(`Failed to load level ${levelNumber}`);
            }

            // Create new player instance with renderer reference
            this.player = new Player(this.level.player.x, this.level.player.y, this.renderer);
            this.player.setupControls(this.level);
            
            // Update level info
            this.updateLevelInfo();
            
            console.log(`Level ${levelNumber} loaded successfully`);
            return true;
        } catch (error) {
            console.error('Error loading level:', error);
            return false;
        }
    }

    updateLevelInfo() {
        // Update level title
        this.levelTitle.textContent = `Level ${this.currentLevel}`;
        
        // Update level description
        const description = this.level.getDescription();
        this.levelDescription.textContent = description || '';
        
        // Add timer info if level has one
        if (this.level.hasTimer()) {
            const timerInfo = ` | Time: ${this.level.getTimeRemaining()}s`;
            this.levelTitle.textContent += timerInfo;
            
            // Add pulse animation if timer is running
            if (this.level.timerStarted) {
                this.levelTitle.classList.add('pulse');
            } else {
                this.levelTitle.classList.remove('pulse');
            }
        }
    }

    handleLevelComplete() {
        console.log('Level complete!');
        this.stopGameLoop();
        
        const overlay = document.getElementById('levelCompleteOverlay');
        const levelNumber = document.getElementById('levelNumber');
        const nextLevelBtn = document.getElementById('nextLevelBtn');
        const title = document.getElementById('levelCompleteTitle');
        
        title.textContent = 'Level Complete!';
        levelNumber.textContent = `Level ${this.currentLevel}`;
        
        // Show/hide next level button based on whether there are more levels
        nextLevelBtn.style.display = this.currentLevel < this.totalLevels ? 'block' : 'none';
        
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 50);
    }

    handleLevelFailed() {
        console.log('Level failed!');
        this.stopGameLoop();
        
        const overlay = document.getElementById('levelCompleteOverlay');
        const levelNumber = document.getElementById('levelNumber');
        const nextLevelBtn = document.getElementById('nextLevelBtn');
        const title = document.getElementById('levelCompleteTitle');
        
        title.textContent = 'Level Failed';
        levelNumber.textContent = `Level ${this.currentLevel}`;
        nextLevelBtn.style.display = 'none';
        
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 50);
    }

    async restartLevel() {
        console.log('Restarting current level...');
        const success = this.level.resetLevel();
        if (!success) {
            console.error('Failed to reset level');
            return;
        }
        
        // Reset player position
        this.player.cleanup(); // Clean up old player
        this.player = new Player(this.level.player.x, this.level.player.y, this.renderer);
        this.player.setupControls(this.level);
        
        // Reset level info
        this.updateLevelInfo();
        
        // Hide overlay
        const overlay = document.getElementById('levelCompleteOverlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            document.getElementById('levelCompleteTitle').textContent = 'Level Complete!';
        }, 500);
        
        // Restart game loop
        this.startGameLoop();
    }

    async loadNextLevel() {
        console.log('Loading next level...');
        this.currentLevel++;
        if (this.currentLevel > this.totalLevels) {
            console.log('Game complete!');
            return;
        }
        
        const success = await this.loadLevel(this.currentLevel);
        if (!success) {
            console.error('Failed to load next level');
            return;
        }
        
        // Update active button
        this.updateActiveLevelButton();
        
        // Hide overlay
        const overlay = document.getElementById('levelCompleteOverlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
        
        // Restart game loop
        this.startGameLoop();
    }

    gameLoop() {
        if (!this.isGameRunning) return;

        try {
            // Update player
            this.player.update(this.level);
            
            // Update timer if level has one
            if (this.level.hasTimer()) {
                const timerValid = this.level.updateTimer();
                if (!timerValid) {
                    this.handleLevelFailed();
                    return;
                }
                this.updateLevelInfo();
            }
            
            // Check for level completion
            if (this.level.isOrb(this.player.x, this.player.y)) {
                this.handleLevelComplete();
                return;
            }
            
            // Render everything
            this.renderer.render(this.level, this.player);
            
            // Continue the loop
            this.animationFrameId = requestAnimationFrame(this.gameLoop);
        } catch (error) {
            console.error('Error in game loop:', error);
            this.stopGameLoop();
        }
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    const game = new Game();
    game.init();
    
    // Setup level complete overlay buttons
    document.getElementById('replayBtn').addEventListener('click', () => {
        game.restartLevel();
    });
    
    document.getElementById('nextLevelBtn').addEventListener('click', () => {
        game.loadNextLevel();
    });
}); 