// src/scenes/BootScene.js
export default class BootScene extends Phaser.Scene {
    constructor() {
      super('BootScene');
    }
  
    preload() {
      // Placeholder graphics
      this.load.image('orb', 'assets/sprites/orb.png');
      this.load.image('player', 'assets/sprites/player.png');
      this.load.image('wall', 'assets/tilesets/wall.png');
  
      // Load first level JSON
      this.load.json('level1', 'src/levels/level1.json');
    }
  
    create() {
      this.scene.start('LevelScene', { levelKey: 'level1' });
    }
  }