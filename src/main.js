// src/main.js
import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import LevelScene from './scenes/LevelScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0a0a0a',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [BootScene, LevelScene],
  pixelArt: true
};

new Phaser.Game(config);