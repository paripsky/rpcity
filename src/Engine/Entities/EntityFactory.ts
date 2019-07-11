import AssetsManager from '../Textures/TextureManager';
import Point from '../Utils/Point';
import Size from '../Utils/Size';
import Person from './Person/Person';
import Car from './Vehicle/Car/Car';

export default class EntityFactory {
    private assetsManager: AssetsManager;

    public constructor(assetsManager: AssetsManager) {
        this.assetsManager = assetsManager;
    }

    public createCar(): Car {
        const car: Car = new Car({ texture: this.assetsManager.get('car') });
        // const drivingBehavior: IBehavior = new DrivingBehavior();
        // car.addBehavior(drivingBehavior);
        return car;
    }

    public createNPCCar(texture: string = 'blackCar', position?: Point, size?): Car {
        const car: Car = new Car({ texture: this.assetsManager.get(texture), size, position });
        return car;
    }

    public createPlayer(texture: string = 'player1', position: Point, size: Size): Person {
        const player: Person = new Person({ texture: this.assetsManager.get('player1') });
        player.setPosition(position);
        player.setSize(size);
        // const walkingBehavior: IBehavior = new WalkingBehavior();
        // player.addBehavior(walkingBehavior);
        return player;
    }
}
