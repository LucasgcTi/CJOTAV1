import * as Phaser from 'phaser';

export default class Donut extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {

        super(scene, x, y, 'donut');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.allowGravity = true;

        this.setScale(0.2);

        // aremesso

        this.setVelocityX(500);
        this.setVelocityY(-250);

    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Atualização do donut
    // ----------------------------------------------------------------------------------------------------------------

    update() {

    this.angle += 10;

    if (
        this.x > this.scene.scale.width + 100 ||
        this.y > this.scene.scale.height + 100
    ) {
        this.destroy();
    }
}
}