import AssetsManager from '../Textures/TextureManager';
import InputManager from '../Input/InputManager';
import Scene from '../Scene/Scene';
import SoundManager from '../Sound/SoundManager';

export default class GameContext {
    public canvas: HTMLCanvasElement = document.querySelector('canvas');
    public assets: AssetsManager;
    public input: InputManager;
    public scene: Scene;
    public sound: SoundManager;

    public constructor(
        canvas: HTMLCanvasElement = document.querySelector('canvas'),
        assetsManager: AssetsManager = new AssetsManager(),
        inputManager: InputManager,
        soundManager: SoundManager = new SoundManager(),
        scene?: Scene,
    ) {
        this.canvas = canvas;
        this.assets = assetsManager;
        this.input = inputManager;
        this.sound = soundManager;
        this.scene = scene;
        this.canvas.focus();
    }
}
