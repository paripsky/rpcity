import AssetsManager from '../Textures/TextureManager';
import InputManager from '../Input/InputManager';
import Renderer2D from '../Rendering/Renderer2D';
import Scene from '../Scene/Scene';
import GameContext from './GameContext';
import Renderer from '../Rendering/Renderer';

export default abstract class Game {
    private lastTime: number;
    private fpsLimit: number = 120;
    private canvas: HTMLCanvasElement = document.querySelector('canvas');
    protected gameContext: GameContext;
    private gameTimeout: number | null = null;
    private renderer: Renderer = new Renderer2D(this.canvas);
    private wasSetup = false;
    public isRunnig = false;

    public constructor() {
        this.gameContext = new GameContext(
            this.canvas,
            new AssetsManager(),
            new InputManager(this.canvas, this.isGameRunning),
        );
    }

    public isGameRunning = (): boolean => {
        return this.isRunnig;
    };

    public abstract async setup(gameContext: GameContext): Promise<this>;

    public setScene(scene: Scene): void {
        scene.setup(this.gameContext);
        this.gameContext.scene = scene;
    }

    public start = async () => {
        if (!this.wasSetup) {
            await this.setup(this.gameContext);
            this.wasSetup = true;
        }

        if (!this.gameContext.scene) {
            throw new Error('Error: Game.start was called without setting a scene');
        }

        this.isRunnig = true;
        this.lastTime = performance.now();
        this.update();
    };

    public update = async () => {
        const { renderer } = this;
        const delta = performance.now() - this.lastTime;
        const fps = Math.round(1000 / delta).toString();
        renderer.clearScreen();
        renderer.drawText(fps, { x: renderer.canvas.width - 30, y: 10 });
        this.gameContext.scene.draw(this.gameContext, renderer, delta / 1000);
        this.lastTime = performance.now();

        // FIXME: higher than 60fps?
        this.gameTimeout = setTimeout(this.update, 1000 / this.fpsLimit);
    };

    public stop = async () => {
        clearTimeout(this.gameTimeout);
        this.isRunnig = false;
    };
}
