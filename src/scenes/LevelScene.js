// src/scenes/LevelScene.js
export default class LevelScene extends Phaser.Scene {
    constructor() {
      super('LevelScene');
    }
  
    init(data) {
      this.levelKey = data.levelKey;
    }
  
    create() {
      const levelData = this.cache.json.get(this.levelKey);
  
      this.player = this.physics.add.sprite(
        levelData.playerStart[0] * 32,
        levelData.playerStart[1] * 32,
        'player'
      ).setCollideWorldBounds(true);
  
      this.orb = this.physics.add.staticSprite(
        levelData.orb.position[0] * 32,
        levelData.orb.position[1] * 32,
        'orb'
      );
  
      this.physics.add.overlap(this.player, this.orb, () => {
        this.scene.restart(); // Restart for now, until level system added
      });
  
      this.cursors = this.input.keyboard.createCursorKeys();
    }
  
    update() {
      const speed = 160;
      this.player.setVelocity(0);
  
      if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
      if (this.cursors.right.isDown) this.player.setVelocityX(speed);
      if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
      if (this.cursors.down.isDown) this.player.setVelocityY(speed);
    }
  }