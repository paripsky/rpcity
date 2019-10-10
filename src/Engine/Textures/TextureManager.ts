import { Texture } from './Texture';

export default class AssetsManager {
    private textures: Map<string, HTMLImageElement> = new Map();

    public loadFromUrl = async (url: string, name: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const isImageInCache: boolean = this.textures.has(url);
            const image: HTMLImageElement = isImageInCache ? this.textures.get(name) : new Image();
            image.src = url;
            image.onload = () => {
                this.textures.set(name, image);
                resolve(image);
            };
            image.onerror = () => {
                reject(`Texture failed to load: ${name} - ${url}`);
            };
        });
    };

    public load = async (assets: Texture[]): Promise<void> => {
        for (const asset of assets) {
            try {
                await this.loadFromUrl(asset.url, asset.name);
            } catch (err) {
                console.error(err);
            }
        }
    };

    public get(name: string): HTMLImageElement {
        return this.textures.get(name);
    }
}
