import { generateId } from '../Utils/ID';
import Point, { rotatePoint } from '../Utils/Point';
import Rectangle from '../Utils/Rectangle';
import Size from '../Utils/Size';
import Component from '../Component';
import Renderer from '../Rendering/Renderer';
import GameContext from '../Game/GameContext';
import { Controller } from './Controller';

export enum EntityType {
    Person,
    Vehicle,
}

export interface EntityState {
    position: Point;
    angle: number;
    velocityX: number;
    velocityY: number;
    controlledBy: Controller;
}

export default abstract class Entity<T = {}> extends Component<EntityState, T> {
    protected texture: HTMLImageElement;
    protected size: Size;
    protected id: string;

    public constructor({ texture, size = { width: 50, height: 80 }, position = { x: 300, y: 300 } }) {
        super();
        (this.id = generateId()), (this.size = size);
        this.texture = texture;
        this.setState({
            position,
            angle: 0,
            velocityX: 0,
            velocityY: 0,
            controlledBy: Controller.None,
        });
    }

    public setController(controller: Controller): this {
        this.state.controlledBy = controller;
        return this;
    }

    public getController(): Controller {
        return this.state.controlledBy;
    }

    public setup(gameContext: GameContext): void {}

    public die(gameContext: GameContext): void {
        console.info(`Entity ${this.id} died.`);
        gameContext.scene.removeEntity(this.id);
    }

    public setPosition(position: Point): void {
        this.setState({
            position,
        });
    }

    public addToXPosition(toAdd: number): void {
        const position = this.getPosition();
        this.setPosition({ ...position, x: position.x + toAdd });
    }

    public addToYPosition(toAdd: number): void {
        const position = this.getPosition();
        this.setPosition({ ...position, y: position.y + toAdd });
    }

    public setSize(size: Size): void {
        this.size = size;
    }

    public setAngle(angle: number): void {
        this.setState({
            angle,
        });
    }

    public getPosition(): Point {
        return this.state.position;
    }

    public getId(): string {
        return this.id;
    }

    public getRect(): Rectangle {
        const { angle, position } = this.state;
        const size = this.size;
        const center = position;
        const topLeft = rotatePoint(
            {
                x: position.x - size.width / 2,
                y: position.y - size.height / 2,
            },
            center,
            angle,
        );
        const topRight = rotatePoint(
            {
                x: position.x + size.width / 2,
                y: position.y - size.height / 2,
            },
            center,
            angle,
        );
        const bottomLeft = rotatePoint(
            {
                x: position.x - size.width / 2,
                y: position.y + size.height / 2,
            },
            center,
            angle,
        );
        const bottomRight = rotatePoint(
            {
                x: position.x + size.width / 2,
                y: position.y + size.height / 2,
            },
            center,
            angle,
        );

        return {
            bottomLeft,
            bottomRight,
            topLeft,
            topRight,
        };
    }

    public render(renderer: Renderer): void {
        const { position, angle } = this.state;
        const { texture, size } = this;
        renderer.drawImage(texture, position.x, position.y, size.width, size.height, angle);
    }
}
