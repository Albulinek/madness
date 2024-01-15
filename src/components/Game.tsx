// src/components/Game.tsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameScene } from './GameScene';

const Game: React.FC = () => {
    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: 'game-container',
            width: 800,
            height: 600,
            scene: GameScene
        };

        // Create a new game instance
        const game = new Phaser.Game(config);

        // Cleanup function
        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container"></div>;
};

export default Game;
