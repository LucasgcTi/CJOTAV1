import * as Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }
    preload() {
        this.displayProgressBar();
        this.load.spritesheet('hacker', '/assets/images/hacker.png', {
            frameWidth: 128,
            frameHeight: 128
        }
        );
        this.load.image('cenario', '/assets/images/background.png');
        this.load.image('menu-bg', '/assets/images/background.png');
        this.load.spritesheet(
            'player',
            '/assets/images/avelinoguarda.png',
            {
                frameWidth: 384,
                frameHeight: 512
            }
        );
        this.load.audio('menuMusic', '/assets/audio/abertura.mp3');
        this.load.audio(
            'musicbatlle',
            '/assets/audio/musicbatlle.mp3'
        );

        this.load.audio(
            'walk',
            '/assets/audio/walk.mp3'
        );

        this.load.audio(
            'damage',
            '/assets/audio/damage.mp3'
        );

        this.load.audio(
            'hacker',
            '/assets/audio/hacker.mp3'
        );
        this.load.image('logo', '/assets/images/logo.png');
        this.load.image('server', '/assets/images/Servidor1.png');
        this.load.image('donut', '/assets/images/donad.png');
    }
    create() {
        this.scene.start('MenuScene');
    }
    displayProgressBar() {
        const { width, height } = this.cameras.main;
        const progressBarBg = this.add.graphics();
        progressBarBg.fillStyle(0x222222, 0.8);
        progressBarBg.fillRect(width / 4 - 2, height / 2 - 12, width / 2 + 4, 24);
        const progressBar = this.add.graphics();
        const loadingText = this.add.text(
            width / 2,
            height / 2 - 30,
            'loading...',
            {
                fontSize: '20px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4, height / 2 - 10, (width / 2) * value, 20);
        });
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBarBg.destroy();
            loadingText.destroy();
        });

    }
}
