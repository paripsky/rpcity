import GameContext from '../../Game/GameContext';
import Keys from '../../Input/Keys';
import Entity from '../Entity';
import Point from '../../Utils/Point';
import Component from '../../Component';
import Bullet from '../Bullet';
import MouseEvents from '../../Input/MouseEvents';
import { Controller } from '../Controller';

export default class Person extends Entity {
    private velocityX: number = 0;
    private velocityY: number = 0;
    private speed: number = 1;

    public setup(gameContext: GameContext): void {
        const shoot = (): void => {
            if (this.state.controlledBy === Controller.Player) {
                this.shootBullet(5, gameContext);
            }
        };

        gameContext.input.on(MouseEvents.Click, null, shoot);
    }

    public update(gameContext: GameContext, timeDelta: number): void {
        const { input: inputManager } = gameContext;

        if (this.state.controlledBy === Controller.Player) {
            let angle: number;
            if (inputManager.isKeyDown(Keys.Up)) {
                angle = Math.PI;
            } else if (inputManager.isKeyDown(Keys.Down)) {
                angle = Math.PI * 2;
            }

            if (inputManager.isKeyDown(Keys.Left)) {
                if (angle) {
                    angle = (angle + 1.5 * Math.PI) / 2;
                } else {
                    angle = 1.5 * Math.PI;
                }
            } else if (inputManager.isKeyDown(Keys.Right)) {
                if (angle) {
                    angle = angle === Math.PI * 2 ? 0 : angle;
                    angle = (angle + Math.PI / 2) / 2;
                } else {
                    angle = Math.PI / 2;
                }
            }

            if (angle) {
                this.velocityX = Math.sin(angle) * this.speed;
                this.velocityY = Math.cos(angle) * this.speed;
            } else {
                this.velocityX = 0;
                this.velocityY = 0;
            }

            this.addToXPosition(this.velocityX);
            this.addToYPosition(this.velocityY);
            this.setAngle(inputManager.getMouseAngle());
        }
    }

    public onCollision(gameContext: GameContext, component: Component<unknown>, collisionPoint: Point): void {}

    public shootBullet(speed: number, gameContext: GameContext): void {
        // if (performance.now() - previousShot > bulletDelay) {
        const { position, angle } = this.state;
        gameContext.scene.addEntity(new Bullet({ position, angle }));
        // }
    }
}
