import { Sound } from './Sound';

interface AudioPlaybackOptions {
    loop: boolean;
    volume: number;
}

export default class SoundManager {
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private currentlyPlaying: Map<string, HTMLAudioElement> = new Map();
    private soundId: number = 0;

    public loadFromUrl = async (url: string, name: string): Promise<HTMLAudioElement> => {
        return new Promise(resolve => {
            const isSoundCached: boolean = this.sounds.has(url);
            const sound: HTMLAudioElement = isSoundCached ? this.sounds.get(name) : new Audio();
            sound.src = url;
            sound.oncanplay = () => {
                this.sounds.set(name, sound);
                resolve(sound);
            };
        });
    };

    public load = async (assets: Sound[]): Promise<void> => {
        for (const asset of assets) {
            await this.loadFromUrl(asset.url, asset.name);
        }
    };

    public play(sound: string, playbackOptions: Partial<AudioPlaybackOptions> = {}): string {
        const { loop = false, volume = 1 } = playbackOptions;
        const audioElement: HTMLAudioElement = this.sounds.get(sound).cloneNode() as HTMLAudioElement;
        const id = `${sound}${this.soundId++}`;
        audioElement.volume = volume;
        audioElement.play();
        audioElement.onended = () => {
            if (loop) {
                audioElement.play();
            } else {
                this.currentlyPlaying.delete(id);
            }
        };
        this.currentlyPlaying.set(id, audioElement);

        return id;
    }
}
