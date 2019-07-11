import { Texture } from './Texture';

export default class AssetsManager {
    private textures: Map<string, HTMLImageElement> = new Map();

    public loadFromUrl = async (url: string, name: string): Promise<HTMLImageElement> => {
        return new Promise(resolve => {
            const isImageInCache: boolean = this.textures.has(url);
            const image: HTMLImageElement = isImageInCache ? this.textures.get(name) : new Image();
            image.src = url;
            image.onload = () => {
                this.textures.set(name, image);
                resolve(image);
            };
        });
    };

    public load = async (assets: Texture[]): Promise<void> => {
        for (const asset of assets) {
            await this.loadFromUrl(asset.url, asset.name);
        }
    };

    public get(name: string): HTMLImageElement {
        return this.textures.get(name);
    }
}
