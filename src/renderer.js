class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.images = {};
        this.tileSize = 40; // Size of each tile in pixels
        this.setupCanvas();
    }

    setupCanvas() {
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 800;
        
        // Set up the context
        this.ctx.imageSmoothingEnabled = false; // For crisp pixel art
        
        console.log('Canvas setup complete:', {
            width: this.canvas.width,
            height: this.canvas.height,
            tileSize: this.tileSize
        });
    }

    async loadImages() {
        console.log('Loading images...');
        const imageFiles = {
            wall: 'assets/images/wall.png',
            floor: 'assets/images/floor.png',
            player: 'assets/images/player.png',
            orb: 'assets/images/orb.png',
            crate: 'assets/images/crate.png'
        };

        const loadPromises = Object.entries(imageFiles).map(([key, path]) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    console.log('Loaded image:', path);
                    this.images[key] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.error('Failed to load image:', path);
                    reject(new Error(`Failed to load image: ${path}`));
                };
                img.src = path;
            });
        });

        await Promise.all(loadPromises);
        console.log('All images loaded successfully');
    }

    render(level, player) {
        if (!level || !player) {
            console.error('Missing level or player data');
            return;
        }

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate center position
        const centerX = Math.floor(this.canvas.width / 2);
        const centerY = Math.floor(this.canvas.height / 2);

        // Calculate offset to center the player
        const offsetX = centerX - (player.x * this.tileSize);
        const offsetY = centerY - (player.y * this.tileSize);

        // Draw the level
        const grid = level.getGrid();
        const gridWidth = level.getGridWidth();
        const gridHeight = level.getGridHeight();

        // Draw floor tiles first
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const screenX = x * this.tileSize + offsetX;
                const screenY = y * this.tileSize + offsetY;

                // Only draw if the tile is visible on screen
                if (this.isTileVisible(screenX, screenY)) {
                    // Draw floor tile
                    this.ctx.drawImage(
                        this.images.floor,
                        screenX,
                        screenY,
                        this.tileSize,
                        this.tileSize
                    );

                    // Draw wall if present
                    if (grid[y][x] === 'W') {
                        this.ctx.drawImage(
                            this.images.wall,
                            screenX,
                            screenY,
                            this.tileSize,
                            this.tileSize
                        );
                    }

                    // Draw crate if present
                    if (grid[y][x] === 'C') {
                        this.ctx.drawImage(
                            this.images.crate,
                            screenX,
                            screenY,
                            this.tileSize,
                            this.tileSize
                        );
                    }
                }
            }
        }

        // Draw orb
        const orbPos = level.getOrbPosition();
        const orbScreenX = orbPos[0] * this.tileSize + offsetX;
        const orbScreenY = orbPos[1] * this.tileSize + offsetY;
        if (this.isTileVisible(orbScreenX, orbScreenY)) {
            this.ctx.drawImage(
                this.images.orb,
                orbScreenX,
                orbScreenY,
                this.tileSize,
                this.tileSize
            );
        }

        // Draw player
        const playerScreenX = player.x * this.tileSize + offsetX;
        const playerScreenY = player.y * this.tileSize + offsetY;
        if (this.isTileVisible(playerScreenX, playerScreenY)) {
            this.ctx.drawImage(
                this.images.player,
                playerScreenX,
                playerScreenY,
                this.tileSize,
                this.tileSize
            );
        }

        // Debug information
        console.log('Rendering frame:', {
            playerPos: { x: player.x, y: player.y },
            screenPos: { x: playerScreenX, y: playerScreenY },
            offset: { x: offsetX, y: offsetY },
            gridWidth: gridWidth,
            gridHeight: gridHeight,
            tileSize: this.tileSize,
            hits: level.getHits()
        });
    }

    isTileVisible(x, y) {
        return x >= -this.tileSize && 
               x <= this.canvas.width && 
               y >= -this.tileSize && 
               y <= this.canvas.height;
    }
}