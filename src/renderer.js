class Renderer {
    constructor(canvas) {
        console.log('Initializing renderer...');
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.images = {};
        this.tileSize = 64; // Increased tile size for better visibility
        this.viewportWidth = 25;  // Number of tiles visible horizontally
        this.viewportHeight = 25; // Number of tiles visible vertically
        this.scrollX = 0;
        this.scrollY = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 800;
        console.log(`Canvas resized to ${this.canvas.width}x${this.canvas.height}`);
        
        // Calculate visible tiles with buffer for smooth scrolling
        this.visibleTilesX = Math.ceil(this.canvas.width / this.tileSize) + 2;
        this.visibleTilesY = Math.ceil(this.canvas.height / this.tileSize) + 2;
        
        // Create offscreen canvas for better performance
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.canvas.width;
        this.offscreenCanvas.height = this.canvas.height;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        
        // Setup canvas for scrolling
        this.setupScrolling();
        
        // Load images
        this.loadImages().then(() => {
            console.log('Renderer initialized successfully');
        }).catch(error => {
            console.error('Failed to initialize renderer:', error);
        });
    }

    setupScrolling() {
        // Add mouse wheel event listener for zooming
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.tileSize = Math.max(16, Math.min(64, this.tileSize * zoomFactor));
            this.render(); // Re-render with new zoom
        });

        // Add mouse events for dragging
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMouseX;
                const deltaY = e.clientY - this.lastMouseY;
                
                this.scrollX -= deltaX / this.tileSize;
                this.scrollY -= deltaY / this.tileSize;
                
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
                
                this.render(); // Re-render with new scroll position
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });
    }

    async loadImages() {
        console.log('Loading images...');
        const imageFiles = {
            player: 'assets/images/player.png',
            orb: 'assets/images/orb.png',
            floor: 'assets/images/floor.png',
            wall: 'assets/images/wall.png'
        };

        const loadPromises = Object.entries(imageFiles).map(([key, path]) => {
            console.log(`Loading image: ${path}`);
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.images[key] = img;
                    resolve();
                };
                img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
                img.src = path;
            });
        });

        try {
            await Promise.all(loadPromises);
            console.log('All images loaded successfully');
        } catch (error) {
            console.error('Error loading images:', error);
            throw error;
        }
    }

    centerOnPlayer(playerX, playerY) {
        // Calculate the center position
        this.scrollX = playerX - (this.viewportWidth / 2);
        this.scrollY = playerY - (this.viewportHeight / 2);
        
        // Clamp scroll values to prevent showing empty space
        this.scrollX = Math.max(0, Math.min(this.scrollX, this.level.width - this.viewportWidth));
        this.scrollY = Math.max(0, Math.min(this.scrollY, this.level.height - this.viewportHeight));
    }

    render(level, player) {
        if (!level || !player) return;

        // Store level reference for centering
        this.level = level;

        // Center view on player
        this.centerOnPlayer(player.x, player.y);

        // Clear offscreen canvas
        this.offscreenCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate the offset to center the view on the player
        const centerX = Math.floor(this.canvas.width / 2);
        const centerY = Math.floor(this.canvas.height / 2);
        
        // Calculate the starting tile position based on player position
        const startTileX = Math.floor(player.x - (this.visibleTilesX / 2));
        const startTileY = Math.floor(player.y - (this.visibleTilesY / 2));
        
        // Calculate the offset for partial tiles
        const offsetX = (player.x - Math.floor(player.x)) * this.tileSize;
        const offsetY = (player.y - Math.floor(player.y)) * this.tileSize;

        // Draw visible tiles
        for (let y = 0; y < this.visibleTilesY; y++) {
            for (let x = 0; x < this.visibleTilesX; x++) {
                const tileX = startTileX + x;
                const tileY = startTileY + y;
                
                // Skip if tile is outside level bounds
                if (tileX < 0 || tileX >= level.width || tileY < 0 || tileY >= level.height) {
                    continue;
                }

                // Calculate screen position
                const screenX = centerX - (player.x * this.tileSize) + (tileX * this.tileSize);
                const screenY = centerY - (player.y * this.tileSize) + (tileY * this.tileSize);

                // Skip if tile is completely outside the canvas
                if (screenX + this.tileSize < 0 || screenX > this.canvas.width ||
                    screenY + this.tileSize < 0 || screenY > this.canvas.height) {
                    continue;
                }

                // Draw floor
                this.offscreenCtx.drawImage(this.images.floor, screenX, screenY, this.tileSize, this.tileSize);

                // Draw wall if present
                if (level.isWall(tileX, tileY)) {
                    this.offscreenCtx.drawImage(this.images.wall, screenX, screenY, this.tileSize, this.tileSize);
                }

                // Draw orb if present
                if (level.isOrb(tileX, tileY)) {
                    this.offscreenCtx.drawImage(this.images.orb, screenX, screenY, this.tileSize, this.tileSize);
                }
            }
        }

        // Draw player at their actual position
        const playerScreenX = centerX - (player.x * this.tileSize) + (player.x * this.tileSize);
        const playerScreenY = centerY - (player.y * this.tileSize) + (player.y * this.tileSize);

        // Only draw player if they are within level bounds
        if (player.x >= 0 && player.x < level.width && player.y >= 0 && player.y < level.height) {
            this.offscreenCtx.drawImage(
                this.images.player,
                playerScreenX,
                playerScreenY,
                this.tileSize,
                this.tileSize
            );
        }

        // Copy the offscreen canvas to the main canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    }
}