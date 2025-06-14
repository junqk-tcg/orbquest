class Player {
    constructor(x, y, renderer) {
        this.x = x;
        this.y = y;
        this.renderer = renderer;
        this.moveCooldown = 0;
        this.lastMoveTime = 0;
        this.lastPressedKey = null;
        this.validKeys = ['w', 'a', 's', 'd'];
        this.keys = {};
        this.movementQueue = [];
        this.isMoving = false;
    }

    setupControls(level) {
        // Remove any existing listeners
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);

        // Bind the handlers to this instance
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // Add new listeners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        if (this.validKeys.includes(key) && !this.keys[key]) {
            e.preventDefault(); // Prevent default behavior for game keys
            this.keys[key] = true;
            this.lastPressedKey = key;
            
            // Add to movement queue if not already present
            if (!this.movementQueue.includes(key)) {
                this.movementQueue.push(key);
            }
        }
    }

    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        if (this.validKeys.includes(key)) {
            this.keys[key] = false;
            
            // Remove from movement queue
            const index = this.movementQueue.indexOf(key);
            if (index > -1) {
                this.movementQueue.splice(index, 1);
            }
            
            // Update last pressed key if needed
            if (this.lastPressedKey === key) {
                this.lastPressedKey = this.movementQueue.length > 0 ? 
                    this.movementQueue[this.movementQueue.length - 1] : null;
            }
        }
    }

    update(level) {
        const currentTime = Date.now();
        if (currentTime - this.lastMoveTime < 150) return false;

        let newX = this.x;
        let newY = this.y;
        let moved = false;

        // Process movement queue
        if (this.movementQueue.length > 0) {
            const key = this.movementQueue[this.movementQueue.length - 1];
            
            switch(key) {
                case 'w': newY--; moved = true; break;
                case 's': newY++; moved = true; break;
                case 'a': newX--; moved = true; break;
                case 'd': newX++; moved = true; break;
            }
        }

        if (moved && !level.isWall(newX, newY)) {
            this.x = newX;
            this.y = newY;
            this.lastMoveTime = currentTime;
            this.isMoving = true;
            level.recordMovement();
            return level.isOrb(this.x, this.y);
        }

        this.isMoving = false;
        return false;
    }

    getPosition() {
        return {
            x: this.x * this.renderer.tileSize,
            y: this.y * this.renderer.tileSize
        };
    }

    cleanup() {
        // Remove event listeners when player is destroyed
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }
} 