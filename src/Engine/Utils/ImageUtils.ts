export default async function waitForImageLoad(image: HTMLImageElement): Promise<void> {
    return new Promise(resolve => {
        image.onload = () => resolve();
    });
}
