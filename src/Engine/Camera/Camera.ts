import Renderer from '../Rendering/Renderer';

export default interface Camera {
    update(renderer: Renderer): void;
}
