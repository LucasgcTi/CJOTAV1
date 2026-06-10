    import * as Phaser from 'phaser';

    export default class Player extends Phaser.Physics.Arcade.Sprite {

        constructor(scene, x, y) {

            super(scene, x, y, 'player');

            this.scene = scene;

            // Teclas
            this.keys = this.scene.input.keyboard.addKeys({
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D
            });

            this.attackKey =
                this.scene.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.SPACE
                );

            this.init();
        }

        // ----------------------------------------------------------------------------------------------------------------
        // -- Inicialização
        // ----------------------------------------------------------------------------------------------------------------

        init() {

            this.setScale(0.6);

            this.scene.add.existing(this);
            this.scene.physics.add.existing(this);

            this.setImmovable(true);
            this.setCollideWorldBounds(true);

            this.body.allowGravity = false;

            // Controle do som de passos
            this.isWalkingSoundPlaying = false;
            this.walkSound = null;
        }

        // ----------------------------------------------------------------------------------------------------------------
        // -- Atualização
        // ----------------------------------------------------------------------------------------------------------------

        update() {

            this.setVelocityX(0);

            let isMoving = false;

            // --------------------------------------------------------------------------------------------
            // ESQUERDA
            // --------------------------------------------------------------------------------------------

            if (this.keys.left.isDown) {

                this.setVelocityX(-250);

                // Ajuste conforme seu spritesheet
                this.setFlipX(false);

                this.play('player-walk', true);

                isMoving = true;
            }

            // --------------------------------------------------------------------------------------------
            // DIREITA
            // --------------------------------------------------------------------------------------------

            else if (this.keys.right.isDown) {

                this.setVelocityX(250);

                // Ajuste conforme seu spritesheet
                this.setFlipX(true);

                this.play('player-walk', true);

                isMoving = true;
            }

            // --------------------------------------------------------------------------------------------
            // PARADO
            // --------------------------------------------------------------------------------------------

            else {

                this.anims.stop();

                this.setTexture(
                    'player',
                    0
                );
            }

            // --------------------------------------------------------------------------------------------
            // SOM DE PASSOS
            // --------------------------------------------------------------------------------------------

            if (isMoving) {

                if (!this.isWalkingSoundPlaying) {

                    this.walkSound =
                        this.scene.sound.add(
                            'walk',
                            {
                                volume: 0.2,
                                loop: true
                            }
                        );

                    this.walkSound.play();

                    this.isWalkingSoundPlaying = true;
                }
            }
            else {

                if (
                    this.walkSound &&
                    this.walkSound.isPlaying
                ) {

                    this.walkSound.stop();
                }

                this.isWalkingSoundPlaying = false;
            }

            // --------------------------------------------------------------------------------------------
            // ATAQUE
            // --------------------------------------------------------------------------------------------

            if (
                Phaser.Input.Keyboard.JustDown(
                    this.attackKey
                )
            ) {

                if (
                    this.scene.canThrowDonut
                ) {

                    this.scene.throwDonut(
                        this.x,
                        this.y
                    );
                }
            }
        }
    }