import { Asset } from './Asset';

export default class AssetsManager {
    private cache: Map<string, HTMLImageElement> = new Map();

    public loadTextureFromUrl = async (url: string, name: string): Promise<HTMLImageElement> => {
        return new Promise(resolve => {
            const isImageInCache: boolean = this.cache.has(url);
            const image: HTMLImageElement = isImageInCache ? this.cache.get(name) : new Image();
            image.src = url;
            image.onload = () => {
                this.cache.set(name, image);
                resolve(image);
            };
        });
    };

    public getTexture(name: string): HTMLImageElement {
        return this.cache.get(name);
    }

    public loadAssets = async (assets: Asset[]): Promise<void> => {
        for (const asset of assets) {
            await this.loadTextureFromUrl(asset.url, asset.name);
        }
    };
}
