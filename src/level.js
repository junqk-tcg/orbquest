class Level {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.layout = [];
        this.player = { x: 0, y: 0 };
        this.orb = { x: 0, y: 0 };
        this.levelData = null; // Cache for level data
        this.timeLimit = null;
        this.description = "";
        this.timeRemaining = null;
        this.timerStarted = false;
        this.hasMoved = false;
        this.lastTimerUpdate = 0;
    }

    async loadLevel(levelNumber) {
        try {
            console.log(`Loading level ${levelNumber}...`);
            // If we already have the level data cached, use it
            if (this.levelData && this.levelData.levelNumber === levelNumber) {
                console.log('Using cached level data');
                this.resetLevel();
                return true;
            }

            const response = await fetch(`assets/levels/level${levelNumber}.json`);
            if (!response.ok) {
                throw new Error(`Failed to fetch level ${levelNumber}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Level data loaded:', data);
            
            // Cache the level data
            this.levelData = {
                levelNumber: levelNumber,
                data: data
            };
            
            // Update level properties
            this.width = data.gridSize.width;
            this.height = data.gridSize.height;
            this.layout = data.layout;
            this.player = { ...data.playerStart }; // Create a copy of the player position
            this.orb = { ...data.orbPosition }; // Create a copy of the orb position
            this.timeLimit = data.timeLimit || null;
            this.description = data.description || "";
            this.timeRemaining = this.timeLimit;
            this.timerStarted = false;
            this.hasMoved = false;
            this.lastTimerUpdate = Date.now();
            
            console.log(`Level ${levelNumber} loaded successfully`);
            return true;
        } catch (error) {
            console.error('Error loading level:', error);
            return false;
        }
    }

    resetLevel() {
        if (!this.levelData) {
            console.error('No level data available to reset');
            return false;
        }
        
        console.log('Resetting level from cached data');
        const data = this.levelData.data;
        this.width = data.gridSize.width;
        this.height = data.gridSize.height;
        this.layout = data.layout;
        this.player = { ...data.playerStart }; // Reset to initial position
        this.orb = { ...data.orbPosition }; // Reset to initial position
        this.timeLimit = data.timeLimit || null;
        this.description = data.description || "";
        this.timeRemaining = this.timeLimit;
        this.timerStarted = false;
        this.hasMoved = false;
        this.lastTimerUpdate = Date.now();
        return true;
    }

    startTimer() {
        if (this.timeLimit !== null && !this.timerStarted) {
            console.log('Starting timer');
            this.timerStarted = true;
            this.lastTimerUpdate = Date.now();
        }
    }

    updateTimer() {
        if (this.timeLimit === null || !this.timerStarted) {
            return true;
        }

        const now = Date.now();
        const elapsedSeconds = Math.floor((now - this.lastTimerUpdate) / 1000);
        
        if (elapsedSeconds >= 1) {
            this.timeRemaining = Math.max(0, this.timeRemaining - 1);
            this.lastTimerUpdate = now;
            console.log(`Timer updated: ${this.timeRemaining} seconds remaining`);
        }
        
        return this.timeRemaining > 0;
    }

    recordMovement() {
        if (!this.hasMoved) {
            console.log('First movement recorded, starting timer');
            this.hasMoved = true;
            this.startTimer();
        }
    }

    isWall(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return true;
        }
        return this.layout[y][x] === 'W';
    }

    isOrb(x, y) {
        return x === this.orb.x && y === this.orb.y;
    }

    getTimeRemaining() {
        return this.timeRemaining;
    }

    hasTimer() {
        return this.timeLimit !== null;
    }

    getDescription() {
        return this.description;
    }
} 