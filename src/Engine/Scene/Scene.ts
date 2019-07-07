import FollowCamera from '../Camera/Follow';
import Camera from '../Camera/Camera';
import Entity from '../Entities/Entity';
import GameContext from '../Game/GameContext';
import { doPolygonsIntersect } from '../Utils/Collision/PolygonCollision';
import Point from '../Utils/Point';
import Rectangle from '../Utils/Rectangle';
import Renderer from '../Rendering/Renderer';

export default class Scene {
    private entities: Entity[];
    private camera: Camera;
    private gameContext: GameContext;

    public constructor(entities: Entity[]) {
        this.entities = entities;
        this.camera = new FollowCamera(this.entities[0]);
    }

    public setup(gameContext: GameContext): void {
        this.gameContext = gameContext;
        this.entities.forEach(entity => entity.setup(gameContext));
    }

    public draw(gameContext: GameContext, renderer: Renderer, timeDelta: number): void {
        function rectToPointArray(rect: Rectangle): Point[] {
            return [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft];
        }

        this.entities.forEach(entity => {
            const entityRect = entity.getRect();
            this.entities
                .filter(ent => ent !== entity && entity.collidesWithTypes.includes(ent.constructor))
                .forEach(otherEntity => {
                    const otherEntityRect = otherEntity.getRect();
                    if (doPolygonsIntersect(rectToPointArray(entityRect), rectToPointArray(otherEntityRect))) {
                        // tslint:disable-next-line:no-console
                        // console.log('Collision: ', entity, otherEntity);
                        entity.onCollision(gameContext, otherEntity, { x: 0, y: 0 });
                    }
                });
        });

        this.camera.update(renderer);
        this.entities.forEach(entity => {
            entity.update(gameContext, timeDelta);
            entity.render(renderer);
        });
    }

    public addEntity(entity: Entity): void {
        entity.setup(this.gameContext);
        this.entities.push(entity);
    }

    public removeEntity(id: string): void {
        this.entities = this.entities.filter(entity => entity.getId() !== id);
    }
}
