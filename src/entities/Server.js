// ----------------------------------------------------------------------------------------------------------------
// -- Server
// ----------------------------------------------------------------------------------------------------------------

import * as Phaser from 'phaser';

export default class Server extends Phaser.Physics.Arcade.Sprite {

    // ----------------------------------------------------------------------------------------------------------------
    // -- Construtor
    // ----------------------------------------------------------------------------------------------------------------

    constructor(scene, x, y) {

        super(scene, x, y, 'server');

        this.scene = scene;

        this.init();
    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Inicialização
    // ----------------------------------------------------------------------------------------------------------------

    init() {

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // O servidor não se move
        this.setImmovable(true);

        // Sem gravidade
        this.body.allowGravity = false;

        // Vida inicial
        this.life = 100;

        // Ajusta a área de colisão do servidor
        this.body.setSize(
            this.width,
            this.height
        );
    }
}