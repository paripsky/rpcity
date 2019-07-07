import waitForImageLoad from '../Utils/ImageUtils';

export async function readTileset(
    tilesetUrl: string,
    tileWidth: number,
    tileHeight: number = tileWidth,
): Promise<Map<string, HTMLImageElement>> {
    const tiles = new Map<string, HTMLImageElement>();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = tileWidth;
    canvas.height = tileHeight;
    const tileset = new Image();
    tileset.src = tilesetUrl;
    await waitForImageLoad(tileset);
    const rows = tileset.height / tileHeight;
    const columns = tileset.width / tileWidth;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ctx.drawImage(tileset, i * tileWidth, j * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
            ctx.drawImage(tileset, j * tileWidth, i * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
            const tileImageDataUrl: string = canvas.toDataURL();
            const tileImage: HTMLImageElement = new Image();
            tileImage.src = tileImageDataUrl;
            tiles.set(`${tilesetUrl}-${i}-${j}`, tileImage);
        }
    }

    return tiles;
}
