// ----------------------------------------------------------------------------------------------------------------
// -- Importações
// ----------------------------------------------------------------------------------------------------------------

import * as Phaser from 'phaser';

import Player from '../entities/Player';
import Hacker from '../entities/Hacker';
import Server from '../entities/Server';
import Donut from '../entities/Donut';

// ----------------------------------------------------------------------------------------------------------------
// -- GameScene
// ----------------------------------------------------------------------------------------------------------------

export default class GameScene extends Phaser.Scene {

    // ----------------------------------------------------------------------------------------------------------------
    // -- Construtor
    // ----------------------------------------------------------------------------------------------------------------

    constructor(config) {

        super({ key: 'GameScene' });

        this.config = config;
    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Inicialização
    // ----------------------------------------------------------------------------------------------------------------

    init() {

    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Criação da cena
    // ----------------------------------------------------------------------------------------------------------------

    create() {

        // Altura do chão
        this.GROUND_Y = 675;

        // Cenário
        this.createBackground();

        // Chão
        //this.createGround();

        // Objetos do jogo
        this.createPlayer();

        this.createServer();

        // Interface
        this.createHUD();

        // Controle de dano
        this.canTakeDamage = true;

        // donut

        this.donuts = [];

        // animação 
        this.anims.create({

            key: 'player-walk',

            frames: this.anims.generateFrameNumbers(
                'player',
                {
                    start: 0,
                    end: 7
                }
            ),

            frameRate: 6,
            repeat: -1
        });

        this.anims.create({

            key: 'hacker-walk',

            frames: this.anims.generateFrameNumbers(
                'hacker',
                {
                    start: 0,
                    end: 7
                }
            ),

            frameRate: 8,

            repeat: -1
        });

        // Cooldown do donut
        this.donutCooldown = 1000;
        this.canThrowDonut = true;

        // Sistema de ondas
        // Sistema de ondas
        this.wave = 1;

        this.hackersToSpawn = 3;

        this.hackersAlive = 0;

        this.hackersKilled = 0;

        // Sistema de pontuação
        this.score = 0;

        // Grupo de hackers
        this.hackersGroup =
            this.add.group();

        this.music = this.sound.add(
            'musicbatlle',
            {
                volume: 0.4,
                loop: true
            }
        );

        this.time.delayedCall(500, () => {

            if (!this.music.isPlaying) {

                this.music.play();
            }
        });

        // Inicia a primeira onda
        this.spawnWave();

        this.isPaused = false;

        this.pauseKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        );

        this.pauseText = this.add.text(
            this.config.width / 2,
            this.config.height / 2,
            'PAUSADO',
            {
                fontSize: '64px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                fontStyle: 'bold'
            }
        )
            .setOrigin(0.5)
            .setVisible(false);

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {

                if (!this.isPaused) {

                    this.elapsedSeconds++;

                    const minutes =
                        Math.floor(this.elapsedSeconds / 60);

                    const seconds =
                        this.elapsedSeconds % 60;

                    this.timerText.setText(
                        `⏱ Tempo: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                    );
                }
            }
        });

        // Colisão com o chão
        //this.physics.add.collider(
        //   this.player,
        //    this.ground
        //);

        //this.physics.add.collider(
        //    this.hacker,
        //  this.ground
        //);
    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Atualização da cena
    // ----------------------------------------------------------------------------------------------------------------

    update() {

        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {

            this.isPaused = !this.isPaused;

            if (this.isPaused) {

                this.physics.pause();

                this.music.pause();

                this.pauseText.setVisible(true);

            } else {

                this.physics.resume();

                this.music.resume();

                this.pauseText.setVisible(false);
            }
        }

        if (this.isPaused) {
            return;
        }

        if (this.player) {
            this.player.update();
        }

        this.hackersGroup.getChildren().forEach(
            hacker => {

                if (hacker.active) {

                    hacker.update();
                }
            }
        );



        this.donuts = this.donuts.filter(
            donut => donut.active
        );

        this.donuts.forEach((donut) => {

            donut.update();

        });

    }


    // ----------------------------------------------------------------------------------------------------------------
    // -- Cenário
    // ----------------------------------------------------------------------------------------------------------------

    createBackground() {

        this.background = this.add.image(
            this.config.width * 0.5,
            this.config.height * 0.5,
            'cenario'
        );

        this.background.setDisplaySize(
            this.config.width,
            this.config.height
        );
    }
    // ----------------------------------------------------------------------------------------------------------------
    // -- Jogador
    // ----------------------------------------------------------------------------------------------------------------

    createPlayer() {

        const startX = 150;
        const startY = this.GROUND_Y;

        this.player = new Player(
            this,
            startX,
            startY
        );

    }


    throwDonut(x, y) {

        if (!this.canThrowDonut) {
            return;
        }

        this.canThrowDonut = false;

        this.cooldownText = this.add.text(
            this.player.x - 50,
            this.player.y - 180,
            '🍩 ATAQUE!',
            {
                fontSize: '22px',
                color: '#ffff00',
                fontStyle: 'bold'
            }
        );

        this.cooldownText.setDepth(1000);

        const bars = [
            '█░░░░░░░░░',
            '██░░░░░░░░',
            '███░░░░░░░',
            '████░░░░░░',
            '█████░░░░░',
            '██████░░░░',
            '███████░░░',
            '████████░░',
            '█████████░',
            '██████████'
        ];

        bars.forEach((bar, index) => {

            this.time.delayedCall(

                index * (this.donutCooldown / 10),

                () => {

                    if (this.cooldownText) {

                        this.cooldownText.setText(
                            `🔴 DONUT\n${bar}`
                        );

                        this.cooldownText.setColor('#ff0000');
                    }

                    this.cooldownText.setColor('#ff0000');

                }
            );

        });

        const donut = new Donut(
            this,
            x + 50,
            y
        );

        this.donuts.push(donut);

        this.hackersGroup.getChildren().forEach(
            hacker => {

                this.physics.add.overlap(

                    donut,

                    hacker,

                    () => {

                        if (!hacker.active) {
                            return;
                        }

                        this.sound.play(
                            'damage',
                            {
                                volume: 0.6
                            }
                        );

                        hacker.takeDamage(50);

                        donut.destroy();

                    },

                    null,

                    this
                );
            }
        );

        this.time.delayedCall(

            this.donutCooldown,

            () => {

                this.canThrowDonut = true;

                if (this.cooldownText) {

                    this.cooldownText.destroy();
                    this.cooldownText = null;
                }

            }
        );
    }
    // ----------------------------------------------------------------------------------------------------------------
    // -- Servidor
    // ----------------------------------------------------------------------------------------------------------------

    createServer() {

        const x = 750;
        const y = this.GROUND_Y - 50;

        this.server = new Server(
            this,
            x,
            y
        );

    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- HUD
    // ----------------------------------------------------------------------------------------------------------------

    createHUD() {

        this.serverLife = 100;
        this.maxLifeBarWidth = 600;
        // Texto do servidor
        this.add.text(
            20,
            35,
            '🖥 SERVIDOR',
            {
                fontSize: '28px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                fontStyle: 'bold'
            }
        );

        // Barra de vida
        this.lifeBarBg = this.add.rectangle(
            20,
            15,
            this.maxLifeBarWidth,
            16,
            0x333333
        );

        this.lifeBarBg.setOrigin(0, 0.5);

        this.lifeBar = this.add.rectangle(
            20,
            15,
            this.maxLifeBarWidth,
            16,
            0x00ff00
        );

        this.lifeBar.setOrigin(0, 0.5);

        // Porcentagem
        this.serverLifeText = this.add.text(
            330,
            5,
            '100%',
            {
                fontSize: '28px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                fontStyle: 'bold'
            }
        );

        this.waveText = this.add.text(
            650,
            5,
            '🌊 Onda: 1',
            {
                fontSize: '28px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                fontStyle: 'bold'
            }
        );

        this.hackersText = this.add.text(
            650,
            35,
            '👾 Hackers: 0',
            {
                fontSize: '28px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                fontStyle: 'bold'
            }
        );

        this.timerText = this.add.text(
            20,
            65,
            '⏱ Tempo: 00:00',
            {
                fontSize: '28px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                fontStyle: 'bold'
            }
        );

        this.scoreText = this.add.text(
            650,
            65,
            '⭐ Pontos: 0',
            {
                fontSize: '28px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                fontStyle: 'bold'
            }
        );

        // Marca o início da partida
        this.startTime = this.time.now;
        this.elapsedSeconds = 0;

    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Inicia uma onda
    // ----------------------------------------------------------------------------------------------------------------

    spawnWave() {

        this.hackersAlive = this.hackersToSpawn;

        for (let i = 0; i < this.hackersToSpawn; i++) {

            this.time.delayedCall(

                i * 1500,

                () => {

                    this.spawnHacker();

                }

            );
        }
    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Cria hacker
    // ----------------------------------------------------------------------------------------------------------------

    spawnHacker() {

        const hacker = new Hacker(

            this,

            this.config.width + 100,

            this.GROUND_Y

        );

        hacker.life = 100;

        hacker.isDead = false;

        this.physics.add.overlap(

            hacker,

            this.server,

            this.damageServer,

            null,

            this

        );

        this.hackersGroup.add(hacker);
    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Dano no servidor
    // ----------------------------------------------------------------------------------------------------------------

    damageServer(hacker) {

        if (!this.canTakeDamage) {
            return;
        }

        this.canTakeDamage = false;

        this.sound.play(
            'hacker',
            {
                volume: 0.7
            }
        );

        this.serverLife -= 10;

        if (this.serverLife < 0) {
            this.serverLife = 0;
        }


        this.serverLifeText.setText(
            `${this.serverLife}%`
        );

        this.lifeBar.width =
            this.maxLifeBarWidth * (this.serverLife / 100);

        if (this.serverLife > 50) {

            this.lifeBar.fillColor = 0x00ff00;

        }
        else if (this.serverLife > 25) {

            this.lifeBar.fillColor = 0xffff00;

        }
        else {

            this.lifeBar.fillColor = 0xff0000;

        }

        if (hacker && hacker.active) {

            hacker.lifeBar.destroy();
            hacker.lifeBarBg.destroy();

            hacker.destroy();

            this.hackersAlive--;
        }

        this.time.delayedCall(
            1000,
            () => {
                this.canTakeDamage = true;
            }
        );

        if (
            this.hackersAlive <= 0
        ) {

            this.nextWave();
        }

        if (
            this.serverLife <= 0
        ) {

            this.gameOver();
        }
    }
    hackerKilled() {

        this.hackersKilled++;

        this.hackersAlive--;

        this.score += 100;

        this.hackersText.setText(
            `Hackers eliminados: ${this.hackersKilled}`
        );

        this.scoreText.setText(
            `Pontos: ${this.score}`
        );

        if (this.hackersAlive <= 0) {

            this.nextWave();
        }
        this.hackersGroup.children.each(hacker => {

            if (!hacker.active) {

                this.hackersGroup.remove(hacker);
            }

        });
    }

    nextWave() {

    if (this.wave >= 3) {
        this.victory();
        return;
    }

    this.score += 500;

    this.scoreText.setText(
        `Pontos: ${this.score}`
    );

    this.wave++; // ← somente UMA vez

    this.hackersToSpawn += 2;

    this.waveText.setText(
        `🌊 Onda: ${this.wave}`
    );

    const waveMessage = this.add.text(
        this.config.width / 2,
        150,
        `ONDA ${this.wave}`,
        {
            fontSize: '48px',
            color: '#ffff00',
            fontStyle: 'bold'
        }
    ).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
        waveMessage.destroy();
        this.spawnWave();
    });
}
    // ----------------------------------------------------------------------------------------------------------------
    // -- Game Over
    // ----------------------------------------------------------------------------------------------------------------

   gameOver() {

    const overlay = this.add.rectangle(
        this.config.width / 2,
        this.config.height / 2,
        this.config.width,
        this.config.height,
        0x000000,
        0.7
    );

    this.add.text(
        this.config.width / 2,
        180,
        'GAME OVER',
        {
            fontSize: '48px',
            color: '#ff0000'
        }
    ).setOrigin(0.5);

    const restartBtn = this.add.text(
        this.config.width / 2,
        300,
        '🔁 Jogar Novamente',
        {
            fontSize: '32px',
            backgroundColor: '#00aa00',
            padding: {
                x: 20,
                y: 10
            }
        }
    )
    .setOrigin(0.5)
    .setInteractive();

    restartBtn.on('pointerdown', () => {
        this.scene.restart();
    });

    this.physics.pause();
    this.music.pause();
}
    victory() {

    this.physics.pause();
    this.music.pause();
    this.add.text(
        this.config.width / 2,
        180,
        '🏆 VOCÊ VENCEU!',
        {
            fontSize: '48px',
            color: '#ffff00'
        }
    ).setOrigin(0.5);

    const restartBtn = this.add.text(
        this.config.width / 2,
        300,
        'Jogar Novamente',
        {
            fontSize: '32px',
            backgroundColor: '#008800',
            padding: {
                x: 20,
                y: 10
            }
        }
    )
    .setOrigin(0.5)
    .setInteractive();

    restartBtn.on('pointerdown', () => {
        this.scene.restart();
    });
}
}    