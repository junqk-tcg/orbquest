class Level {
    constructor() {
        this.grid = [];
        this.gridWidth = 0;
        this.gridHeight = 0;
        this.timeLimit = 0;
        this.description = '';
        this.timeRemaining = 0;
        this.timerStarted = false;
        this.hasMoved = false;
        this.lastTimerUpdate = 0;
        this.levelCache = new Map();
        this.orb = [0, 0];
        this.start = [0, 0];
        this.crates = [];
        this.hits = 0;
    }

    async loadLevel(levelNumber) {
        try {
            // Check cache first
            if (this.levelCache.has(levelNumber)) {
                const cachedData = this.levelCache.get(levelNumber);
                this.applyLevelData(cachedData);
                return;
            }

            const response = await fetch(`assets/levels/level${levelNumber}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load level ${levelNumber}`);
            }

            const data = await response.json();
            console.log('Loaded level data:', data);

            // Cache the level data
            this.levelCache.set(levelNumber, data);

            // Apply the level data
            this.applyLevelData(data);
        } catch (error) {
            console.error('Error loading level:', error);
            throw error;
        }
    }

    applyLevelData(data) {
        // Handle both old and new level formats
        if (data.gridSize) {
            this.gridWidth = data.gridSize;
            this.gridHeight = data.gridSize;
        } else {
            this.gridWidth = data.gridWidth;
            this.gridHeight = data.gridHeight;
        }

        this.timeLimit = data.timeLimit;
        this.description = data.description;
        this.hits = data.hits || 0;
        this.crates = data.crates || [];
        
        // Convert layout string to 2D array and find P and O positions
        this.grid = data.layout.map((row, y) => {
            return row.split('').map((cell, x) => {
                if (cell === 'P') {
                    this.start = [x, y];
                    return '.';
                }
                if (cell === 'O') {
                    this.orb = [x, y];
                    return '.';
                }
                if (cell === 'C') {
                    this.crates.push([x, y]);
                    return 'C';
                }
                return cell;
            });
        });
        
        console.log('Level loaded successfully:', {
            gridWidth: this.gridWidth,
            gridHeight: this.gridHeight,
            timeLimit: this.timeLimit,
            description: this.description,
            orb: this.orb,
            start: this.start,
            hits: this.hits,
            crates: this.crates
        });
    }

    getGrid() {
        return this.grid;
    }

    getGridWidth() {
        return this.gridWidth;
    }

    getGridHeight() {
        return this.gridHeight;
    }

    getOrbPosition() {
        return this.orb;
    }

    getStartPosition() {
        return this.start;
    }

    getDescription() {
        return this.description;
    }

    isWall(x, y) {
        return this.grid[y][x] === 'W' || this.grid[y][x] === 'C';
    }

    isFloor(x, y) {
        return this.grid[y][x] === '.';
    }

    isOrb(x, y) {
        return x === this.orb[0] && y === this.orb[1];
    }

    isCrate(x, y) {
        return this.grid[y][x] === 'C';
    }

    breakCrate(x, y) {
        if (this.isCrate(x, y)) {
            this.grid[y][x] = '.';
            this.crates = this.crates.filter(([cx, cy]) => !(cx === x && cy === y));
            return true;
        }
        return false;
    }

    getHits() {
        return this.hits;
    }

    useHit() {
        if (this.hits > 0) {
            this.hits--;
            return true;
        }
        return false;
    }

    updateTimer() {
        if (this.timeLimit > 0) {
            this.timeLimit--;
            return this.timeLimit;
        }
        return 0;
    }

    resetLevel() {
        this.timeRemaining = this.timeLimit;
        this.timerStarted = false;
        this.hasMoved = false;
        this.lastTimerUpdate = 0;
    }

    startTimer() {
        if (!this.timerStarted && this.timeLimit > 0) {
            this.timerStarted = true;
            this.lastTimerUpdate = Date.now();
        }
    }

    recordMovement() {
        if (!this.hasMoved) {
            this.hasMoved = true;
            this.startTimer();
        }
    }

    getTimeRemaining() {
        return this.timeRemaining;
    }
} 