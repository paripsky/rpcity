import Point from '../Utils/Point';
import Rectangle from '../Utils/Rectangle';

export default interface Renderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    translation: Point;

    setTranslate(translation: Point): void;
    drawImage(image: HTMLImageElement, x: number, y: number, width?: number, height?: number, angle?: number): void;
    drawText(text: string, position: Point, font?: string): void;
    clearScreen(): void;
    drawRect(rect: Rectangle, fillStyle?: string): void;
}
