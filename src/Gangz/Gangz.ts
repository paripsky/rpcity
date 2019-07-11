import Game from '../Engine/Game/Game';
import EntityFactory from '../Engine/Entities/EntityFactory';
import textures from './textures';
import sounds from './sounds';
import Scene from '../Engine/Scene/Scene';
import GameContext from '../Engine/Game/GameContext';
import KeyboardEvents from '../Engine/Input/KeyboardEvents';
import Keys from '../Engine/Input/Keys';
import { Controller } from '../Engine/Entities/Controller';

export default class Gangz extends Game {
    public setup = async (gameContext: GameContext) => {
        const { assets: assetsManager, sound: soundManager } = this.gameContext;
        const entityFactory = new EntityFactory(assetsManager);
        await assetsManager.load(textures);
        await soundManager.load(sounds);
        const scene: Scene = new Scene([
            entityFactory
                .createPlayer(undefined, { x: 200, y: 100 }, { width: 32, height: 32 })
                .setController(Controller.Player),
            entityFactory.createCar(),
            entityFactory.createNPCCar(undefined, { x: 100, y: 100 }, { width: 50, height: 100 }),
            entityFactory
                .createNPCCar('whiteCar2', { x: 400, y: 200 }, { width: 50, height: 100 })
                .setController(Controller.Player),
        ]);

        let paused = false;
        gameContext.input.on(
            KeyboardEvents.KeyPress,
            Keys.Pause,
            () => {
                if (paused) {
                    this.start();
                } else {
                    this.stop();
                }

                paused = !paused;
            },
            { triggerWhenGamePaused: true },
        );

        this.setScene(scene);
        return this;
    };
}
