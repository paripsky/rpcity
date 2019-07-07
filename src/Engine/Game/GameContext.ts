import AssetsManager from '../Assets/AssetsManager';
import InputManager from '../Input/InputManager';
import Scene from '../Scene/Scene';

export default class GameContext {
    public canvas: HTMLCanvasElement = document.querySelector('canvas');
    public assets: AssetsManager;
    public input: InputManager;
    public scene: Scene;

    public constructor(
        canvas: HTMLCanvasElement = document.querySelector('canvas'),
        assetsManager: AssetsManager = new AssetsManager(),
        inputManager: InputManager,
        scene?: Scene,
    ) {
        this.canvas = canvas;
        this.assets = assetsManager;
        this.input = inputManager;
        this.scene = scene;
        this.canvas.focus();
    }
}
