import Game from './Engine/Game/Game';
import Gangz from './Gangz/Gangz';
import { readTileset } from './Engine/TileSets/TileSetsReader';

const templeTileset = readTileset(require('../assets/temple-tileset.png'), 16);
templeTileset.then(templeTs => {
    console.log(templeTs);
    templeTs.forEach(tile => {
        document.body.appendChild(tile);
    });
});
const playerTileset = readTileset(require('../assets/player-tileset.png'), 100, 128);
playerTileset.then(templeTs => {
    console.log(templeTs);
    templeTs.forEach(tile => {
        document.body.appendChild(tile);
    });
});
const gm: Game = new Gangz();
gm.start();

// TODO: make the game functional instead of OOP
