import Entity, { EntityState } from './Entity';
import GameContext from '../Game/GameContext';
import Component from '../Component';
import Point from '../Utils/Point';

interface BulletState {
    shotAt: number;
}

export default class Bullet extends Entity<BulletState> {
    private timeToLive: number = 3000;

    public constructor(props) {
        super(props);
        const { position, angle } = props;
        const speed = 1000;
        this.setState({
            position,
            angle,
            velocityX: speed * Math.sin(angle),
            velocityY: -1 * speed * Math.cos(angle),
            shotAt: performance.now(),
        });
    }

    public setup(gameContext: GameContext): void {
        this.texture = gameContext.assets.getTexture('bullet');
        this.size = { width: 5, height: 15 };
    }

    public update(gameContext: GameContext, timeDelta: number): void {
        const previousPosition = this.state.position;
        this.setState({
            position: {
                x: previousPosition.x + this.state.velocityX * timeDelta,
                y: previousPosition.y + this.state.velocityY * timeDelta,
            },
        });

        if (performance.now() - this.state.shotAt > this.timeToLive) {
            this.die(gameContext);
        }
    }

    public onCollision(gameContext: GameContext, component: Component<unknown>, collisionPoint: Point): void {
        throw new Error('Method not implemented.');
    }
}
