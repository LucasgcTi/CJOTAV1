import * as Phaser from 'phaser';

// Cena responsável pelos créditos do jogo
export default class CreditsScene extends Phaser.Scene {

    constructor() {
        super({ key: 'CreditsScene' });
    }

    create() {

        // Obtém largura e altura da tela
        const { width, height } = this.scale;

        // Cor de fundo
        this.cameras.main.setBackgroundColor('#18122B');

        // Título
        this.add.text(
            width / 2,
            100,
            'CRÉDITOS',
            {
                fontSize: '56px',
                color: '#FFD166',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Texto dos créditos
        this.add.text(
            width / 2,
            height / 2,
            [
                'DONUT DEFENDER',
                '',
                'Desenvolvido por:',
                'Lucas Gomes da Cunha',
                '',
                'Projeto acadêmico utilizando Phaser 3'
            ],
            {
                fontSize: '28px',
                color: '#FFFFFF',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Botão voltar
        const backButton = this.add.text(
            width / 2,
            height - 120,
            'VOLTAR',
            {
                fontSize: '32px',
                backgroundColor: '#F4A261',
                color: '#000000',
                padding: {
                    left: 20,
                    right: 20,
                    top: 10,
                    bottom: 10
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Efeito ao passar mouse
        backButton.on('pointerover', () => {
            backButton.setScale(1.1);
        });

        backButton.on('pointerout', () => {
            backButton.setScale(1);
        });

        // Retorna ao menu
        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}