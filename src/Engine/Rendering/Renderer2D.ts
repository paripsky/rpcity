import Point from '../Utils/Point';
import Rectangle, { addPointToRectangle } from '../Utils/Rectangle';
import Renderer from './Renderer';

export default class Renderer2D implements Renderer {
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public translation: Point = { x: 0, y: 0 };

    /**
     *
     * @param {HTMLCanvasElement} canvas
     */
    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        window.addEventListener('resize', this.recalculateScale.bind(this));
        this.recalculateScale();
    }

    // FIXME: fix scaling calculations to prevent an advantage for players with wider screens
    public recalculateScale() {
        const resolution = { x: 1650, y: 1080 };
        const { innerWidth, innerHeight } = window;
        const scaleX = resolution.x / innerWidth;
        const scaleY = resolution.y / innerHeight;
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        // this.context.scale(scaleX, scaleY);
    }

    public setTranslate(translation: Point): void {
        this.translation = translation;
    }

    /**
     * Draw an image to the canvas
     * @param {HTMLImageElement} image the image to draw
     * @param {number} x x coordinate
     * @param {number} y y coordinate
     * @param {number} [width] width
     * @param {number} [height] height
     */
    public drawImage(
        image: HTMLImageElement,
        x: number,
        y: number,
        width?: number,
        height?: number,
        angle: number = 0,
    ): void {
        this.context.save();
        // this.context.setTransform(1, 0, 0, 1, x, y);
        this.context.translate(this.translation.x + x, this.translation.y + y);
        // rotate the canvas to the specified degrees
        this.context.rotate(angle);
        if (width !== undefined && height !== undefined) {
            this.context.drawImage(image, -width / 2, -height / 2, width, height);
        } else {
            // this.context.drawImage(image, x, y);
        }

        this.context.restore();
    }

    public drawText(text: string, position: Point, font: string = '14px Arial'): void {
        this.context.font = font;
        this.context.fillText(text, position.x, position.y);
    }

    public clearScreen(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public drawRect(rect: Rectangle, fillStyle: string = 'rgba(0, 0, 0, 1)'): void {
        this.context.save();
        this.context.fillStyle = fillStyle;
        this.context.beginPath();
        addPointToRectangle(rect, this.translation);
        this.context.moveTo(rect.topLeft.x, rect.topLeft.y);
        this.context.lineTo(rect.bottomLeft.x, rect.bottomLeft.y);
        this.context.lineTo(rect.bottomRight.x, rect.bottomRight.y);
        this.context.lineTo(rect.topRight.x, rect.topRight.y);
        this.context.fill();
        this.context.restore();
    }
}
