class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.moveCooldown = 0;
        this.lastKey = null;
        this.direction = 'd'; // Default direction (down)
        this.validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '];
        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.validKeys.includes(e.key)) {
                this.lastKey = e.key;
                // Update direction based on movement key
                switch (e.key) {
                    case 'ArrowUp':
                    case 'w':
                        this.direction = 'u';
                        break;
                    case 'ArrowDown':
                    case 's':
                        this.direction = 'd';
                        break;
                    case 'ArrowLeft':
                    case 'a':
                        this.direction = 'l';
                        break;
                    case 'ArrowRight':
                    case 'd':
                        this.direction = 'r';
                        break;
                }
            }
        });
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    update(level) {
        if (this.moveCooldown > 0) {
            this.moveCooldown--;
            return;
        }

        if (!this.lastKey) return;

        // Handle crate breaking
        if (this.lastKey === ' ') {
            this.breakCrates(level);
            this.lastKey = null;
            return;
        }

        let newX = this.x;
        let newY = this.y;

        switch (this.lastKey) {
            case 'ArrowUp':
            case 'w':
                newY--;
                break;
            case 'ArrowDown':
            case 's':
                newY++;
                break;
            case 'ArrowLeft':
            case 'a':
                newX--;
                break;
            case 'ArrowRight':
            case 'd':
                newX++;
                break;
        }

        // Check if the new position is valid
        if (!level.isWall(newX, newY)) {
            this.x = newX;
            this.y = newY;
            level.recordMovement();
            this.moveCooldown = 5; // Add a small cooldown between moves
        }

        this.lastKey = null;
    }

    breakCrates(level) {
        if (level.getHits() <= 0) return;

        const directions = [
            [0, 1],  // down
            [0, -1], // up
            [1, 0],  // right
            [-1, 0]  // left
        ];

        let brokeAnyCrate = false;
        for (const [dx, dy] of directions) {
            const newX = this.x + dx;
            const newY = this.y + dy;
            if (level.isCrate(newX, newY)) {
                if (level.breakCrate(newX, newY)) {
                    brokeAnyCrate = true;
                }
            }
        }

        if (brokeAnyCrate) {
            level.useHit();
        }
    }

    hasReachedOrb(level) {
        return level.isOrb(this.x, this.y);
    }
} 