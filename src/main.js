import * as Phaser from 'phaser';

import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import CreditsScene from './scenes/CreditsScene.js';

const WIDTH = 1920;
const HEIGHT = 1080;



const SHARED_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    debug: false
};

const SCENES = [
    PreloadScene,
    MenuScene,
    CreditsScene,
    GameScene
];

const createScene = Scene => new Scene(SHARED_CONFIG);


const initScenes = () => SCENES.map(createScene);

const config = {
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    backgroundColor: '#0080ff',
    parent: 'game-container',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300},
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: initScenes()
};

new Phaser.Game(config);