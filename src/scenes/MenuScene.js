export default class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    preload() {

        
        this.load.image(
            'menu-bg',
            'assets/menu/menu-bg.jpg'
        );

    }

    create() {

        const { width, height } = this.scale;

        // FUNDO
        this.add.image(
            width / 2,
            height / 2,
            'menu-bg'
        )
        .setDisplaySize(width, height);

        // OVERLAY
        this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x000000,
            0.32
        );

        // EFEITO SCANLINE
        for (let y = 0; y < height; y += 4) {

            this.add.rectangle(
                width / 2,
                y,
                width,
                1,
                0x00ffcc,
                0.03
            );

        }

        // TÍTULO
        const title = this.add.text(
            width / 2,
            110,
            'CYBER GUARD',
            {
                fontSize: '72px',
                fontStyle: 'bold',
                color: '#66ffcc',
                stroke: '#003344',
                strokeThickness: 8
            }
        )
        .setOrigin(0.5);

        this.tweens.add({
            targets: title,
            alpha: 0.7,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // TERMINAL
        const boot = this.add.text(
            width / 2,
            500,
            'INICIANDO SISTEMA...',
            {
                fontSize: '28px',
                color: '#66ffcc'
            }
        )
        .setOrigin(0.5);

        // BARRA
        const border = this.add.rectangle(
            width / 2,
            560,
            520,
            34
        )
        .setStrokeStyle(
            4,
            0x66ffcc
        );

        const bar = this.add.rectangle(
            width / 2 - 255,
            560,
            0,
            26,
            0x66ffcc
        )
        .setOrigin(0, 0.5);

        this.tweens.add({

            targets: bar,

            width: 510,

            duration: 2600,

            ease: 'Linear',

            onComplete: () => {

                boot.setText(
                    'SISTEMA PRONTO'
                );

                this.showMenu();

            }

        });

    }

    showMenu() {

        const { width } = this.scale;

        const createButton = (
            text,
            y,
            callback
        ) => {

            const btn =
            this.add.text(
                width / 2,
                y,
                text,
                {
                    fontSize: '34px',
                    backgroundColor: '#003333',
                    color: '#66ffcc',
                    padding: {
                        x: 50,
                        y: 15
                    }
                }
            )
            .setOrigin(0.5)
            .setInteractive();

            btn.alpha = 0;

            this.tweens.add({
                targets: btn,
                alpha: 1,
                y,
                duration: 300
            });

            btn.on(
                'pointerover',
                () => {

                    btn.setScale(
                        1.08
                    );

                }
            );

            btn.on(
                'pointerout',
                () => {

                    btn.setScale(
                        1
                    );

                }
            );

            btn.on(
                'pointerdown',
                callback
            );

        };

        createButton(
            '▶ INICIAR',
            650,
            () => {

                this.cameras.main.fade(
                    600,
                    0,
                    0,
                    0
                );

                this.time.delayedCall(
                    600,
                    () =>
                    this.scene.start(
                        'GameScene'
                    )
                );

            }
        );

        createButton(
    '🎬 CRÉDITOS',
    730,
    () => {

        this.cameras.main.fade(
            500,
            0,
            0,
            0
        );

        this.time.delayedCall(
            500,
            () => {

                this.scene.start(
                    'CreditsScene'
                );

            }
        );

    }
);

    }

}