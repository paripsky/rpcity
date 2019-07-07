import Entity from '../Entities/Entity';
import Renderer from '../Rendering/Renderer';
import Camera from './Camera';

export default class FollowCamera implements Camera {
    private entity: Entity;

    public constructor(entity: Entity) {
        this.entity = entity;
    }

    public update(renderer: Renderer): void {
        const { x, y } = this.entity.getPosition();
        const translation = { x: renderer.canvas.width / 2 - x, y: renderer.canvas.height / 2 - y };
        renderer.setTranslate(translation);
    }
}
