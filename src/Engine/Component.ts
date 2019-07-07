import GameContext from './Game/GameContext';
import Point from './Utils/Point';
import Renderer from './Rendering/Renderer';

type partialState<T, K> = Partial<T & K> | Partial<T> | Partial<K>;

export default abstract class Component<T, K = {}> {
    private _state: T & K;
    private _collidesWith: Function[] = [];

    public get state(): T & K {
        return this._state;
    }

    public set state(newState: T & K) {
        this._state = newState;
    }

    public setState(state: partialState<T, K>): void {
        this._state = { ...this.state, ...state };
    }

    public get collidesWithTypes(): Function[] {
        return this._collidesWith;
    }

    public set collidesWithTypes(value: Function[]) {
        this._collidesWith = value;
    }

    public abstract update(gameContext: GameContext, timeDelta: number): void;
    public abstract render(renderer: Renderer): void;
    public abstract onCollision(gameContext: GameContext, component: Component<unknown>, collisionPoint: Point): void;
}
