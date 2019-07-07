import GameContext from '../../Game/GameContext';
import Keys from '../../Input/Keys';
import Entity from '../Entity';
import Component from '../../Component';
import Point from '../../Utils/Point';
import Person from '../Person/Person';
import Renderer from '../../Rendering/Renderer';
import Bullet from '../Bullet';
import { Controller } from '../Controller';

interface VehicleState {
}

export default class Vehicle extends Entity<VehicleState> {
    private velocityX: number = 0;
    private velocityY: number = 0;
    private maxSpeed: number = 3;
    private drag: number = 0.99;
    private angularDrag: number = 0.9;
    private angularVelocity: number = 0;
    private power: number = 0.5;
    private brakingPower: number = 5;
    private traction: number = 0.3;
    private turnSpeed: number = 20;
    private reverseMode: boolean = false;
    private stopThreshold: number = 0.2;
    private wheelMaxAngle: number = Math.PI / 4;

    public constructor(props) {
        super(props);
    }

    // TODO: fixed duplicates in this method
    public update(gameContext: GameContext, timeDelta: number): void {
        const { input: inputManager } = gameContext;
        const { angle, controlledBy } = this.state;

        if (controlledBy === Controller.Player) {
            let currentSpeed = this.magnitude(this.velocityX, this.velocityY);
            if (inputManager.keysDown.includes(Keys.Up)) {
                // this.thrusterOn = true;
                this.reverseMode = false;
                const newAngle = angle;
                if (currentSpeed < this.maxSpeed) {
                    this.velocityX += this.power * Math.sin(newAngle) * timeDelta;
                    this.velocityY -= this.power * Math.cos(newAngle) * timeDelta;
                }
            } else {
                // slow the car down if its not accelerating
                if (currentSpeed > this.stopThreshold) {
                    if (this.velocityX > 0) {
                        this.velocityX -= this.traction * timeDelta;
                    } else {
                        this.velocityX += this.traction * timeDelta;
                    }
                    if (this.velocityY > 0) {
                        this.velocityY -= this.traction * timeDelta;
                    } else {
                        this.velocityY += this.traction * timeDelta;
                    }
                } else {
                    this.velocityX = 0;
                    this.velocityY = 0;
                    this.angularVelocity = 0;
                }
            }

            const velocityMagnitude = this.magnitude(this.velocityX, this.velocityY);

            if (inputManager.keysDown.includes(Keys.Right)) {
                if (velocityMagnitude > this.stopThreshold) {
                    if (!this.reverseMode) {
                        this.angularVelocity += this.turnSpeed * timeDelta;
                    } else {
                        this.angularVelocity -= this.turnSpeed * timeDelta;
                    }
                }
            }

            if (inputManager.keysDown.includes(Keys.Left)) {
                if (velocityMagnitude > this.stopThreshold) {
                    if (!this.reverseMode) {
                        this.angularVelocity -= this.turnSpeed * timeDelta;
                    } else {
                        this.angularVelocity += this.turnSpeed * timeDelta;
                    }
                }
            }

            if (inputManager.keysDown.includes(Keys.Down)) {
                if (!this.reverseMode && velocityMagnitude > this.stopThreshold) {
                    if (this.velocityX > 0) {
                        this.velocityX -= this.brakingPower * timeDelta;
                    } else {
                        this.velocityX += this.brakingPower * timeDelta;
                    }
                    if (this.velocityY > 0) {
                        this.velocityY -= this.brakingPower * timeDelta;
                    } else {
                        this.velocityY += this.brakingPower * timeDelta;
                    }
                } else if (this.reverseMode || (!this.reverseMode && velocityMagnitude <= this.stopThreshold)) {
                    this.reverseMode = true;
                    const oppositeAngle = (angle + Math.PI) % (Math.PI * 2);
                    this.velocityX += this.brakingPower * Math.sin(oppositeAngle) * timeDelta;
                    this.velocityY -= this.brakingPower * Math.cos(oppositeAngle) * timeDelta;
                }
            }

            if (inputManager.keysDown.includes(Keys.Space)) {
                if (velocityMagnitude > this.stopThreshold) {
                    if (this.velocityX > 0) {
                        this.velocityX -= this.brakingPower * timeDelta;
                    } else {
                        this.velocityX += this.brakingPower * timeDelta;
                    }

                    if (this.velocityY > 0) {
                        this.velocityY -= this.brakingPower * timeDelta;
                    } else {
                        this.velocityY += this.brakingPower * timeDelta;
                    }

                    if (this.angularVelocity > 0) {
                        this.angularVelocity -= this.brakingPower * timeDelta;
                    } else {
                        this.angularVelocity += this.brakingPower * timeDelta;
                    }
                } else {
                    this.velocityX = 0;
                    this.velocityY = 0;
                    this.angularVelocity = 0;
                }
            }

            this.setAngle(angle + this.angularVelocity * timeDelta);
            currentSpeed = currentSpeed = this.magnitude(this.velocityX, this.velocityY);
            const yVelocity = this.velocityY === 0 ? 0 : -this.velocityY;
            const speedAngle = this.radianToZeroToPieRange(Math.atan2(this.velocityX, yVelocity));
            let toAngle = (speedAngle - this.state.angle) * timeDelta;
            toAngle = this.state.angle;

            this.velocityX = currentSpeed * Math.sin(toAngle);
            this.velocityY = -currentSpeed * Math.cos(toAngle);
            // this.angle = this.radianToZeroToPieRange(this.angle);
            this.setAngle(this.radianToZeroToPieRange(this.state.angle));
            this.angularVelocity *= this.angularDrag;
            // this.setAngle(this.angle);
            this.addToXPosition(this.velocityX);
            this.addToYPosition(this.velocityY);
        }
    }

    private radianToZeroToPieRange(angleInRadians: number): number {
        if (angleInRadians < 0) {
            angleInRadians = Math.PI * 2 + angleInRadians;
        } else if (angleInRadians >= Math.PI * 2) {
            angleInRadians -= Math.PI * 2;
        }

        return angleInRadians;
    }

    private magnitude(x: number, y: number): number {
        return Math.sqrt(x ** 2 + y ** 2);
    }

    public render(renderer: Renderer): void {
        super.render(renderer);
        if (this.isCollidingWithPerson) {
            renderer.drawRect(this.getRect(), 'rgba(200, 0, 0, 0.4)');
        } else {
            renderer.drawRect(this.getRect(), 'rgba(0, 0, 0, 0.4)');
        }

        this.isCollidingWithPerson = false;
    }

    public collidesWithTypes = [Person, Bullet];
    private isCollidingWithPerson = false;

    public onCollision(gameContext: GameContext, component: Component<unknown>, collisionPoint: Point): void {
        if (component instanceof Person) {
            this.isCollidingWithPerson = true;
            console.log('collided with person', collisionPoint);
        } else if (component instanceof Bullet) {
            component.die(gameContext);
        }
    }
}
