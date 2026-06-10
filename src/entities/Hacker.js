import * as Phaser from 'phaser';

export default class Hacker extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'hacker')

        this.scene = scene;

        this.init();
    }

    init() {

        this.setScale(3);
        this.setFlipX(true);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setImmovable(true);
        this.setCollideWorldBounds(true);

        this.body.allowGravity = false;

        this.life = 100;

        // Barra de vida fundo
        this.lifeBarBg = this.scene.add.rectangle(
            this.x,
            this.y - 180,
            100,
            12,
            0x333333
        );

        // Barra de vida
        this.lifeBar = this.scene.add.rectangle(
            this.x,
            this.y - 180,
            100,    
            12,
            0x00ff00
        );

        this.lifeBar.setOrigin(0.5);

        this.body.setSize(
            this.width * 0.4,
            this.height * 0.8
        );

        // Inicia animação
        this.play('hacker-walk');
    }



    takeDamage(damage) {

        this.life -= damage;

        // Atualiza tamanho da barra
        this.lifeBar.width =
            100 * (this.life / 100);

        // Atualiza cor da barra
        if (this.life > 50) {

            this.lifeBar.fillColor = 0x00ff00; // Verde

        }
        else if (this.life > 25) {

            this.lifeBar.fillColor = 0xffff00; // Amarelo

        }
        else {

            this.lifeBar.fillColor = 0xff0000; // Vermelho

        }

        console.log(
            'Vida do hacker:',
            this.life
        );

        if (this.life <= 0) {

    this.lifeBar.destroy();
    this.lifeBarBg.destroy();

    this.scene.hackerKilled();

    this.destroy();
}

    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Atualização do hacker
    // ----------------------------------------------------------------------------------------------------------------

    update() {

        if (!this.scene.server) {
            return;
        }

        this.lifeBar.x = this.x;
        this.lifeBar.y = this.y - 120;

        this.lifeBarBg.x = this.x;
        this.lifeBarBg.y = this.y - 120;

        if (this.x > this.scene.server.x) {

            this.setVelocityX(-120);
        }
        else {

            this.setVelocityX(0);
        }
    }

}   