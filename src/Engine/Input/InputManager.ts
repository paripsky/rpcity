import { callback } from '../Utils/Callback';
import { generateId } from '../Utils/ID';
import KeyboardEvents from './KeyboardEvents';
import Keys from './Keys';
import MouseEvents from './MouseEvents';

interface InputEventOptions {
    triggerWhenGamePaused?: boolean;
}

type KeyboardOrMouseEvent = KeyboardEvent | MouseEvent;
type KeyboardOrMouseEventNames = KeyboardEvents | MouseEvents;
type eventCallback = (event: KeyboardOrMouseEvent) => void;

export default class InputManager {
    public keysDown: Keys[] = [];
    private mouseAngle: number = 0;
    private canvas: HTMLCanvasElement;
    private eventListeners: Map<string, eventCallback> = new Map();
    private shouldEventsTrigger: () => boolean;

    public constructor(canvas: HTMLCanvasElement, shouldEventsTrigger: () => boolean) {
        this.canvas = canvas;
        this.shouldEventsTrigger = shouldEventsTrigger;
        canvas.addEventListener(KeyboardEvents.KeyDown, event => {
            if (Object.values(Keys).includes(event.code)) {
                this.keysDown.push(event.code as Keys);
            }
        });

        canvas.addEventListener(KeyboardEvents.KeyUp, event => {
            if (Object.values(Keys).includes(event.code)) {
                this.keysDown = this.keysDown.filter(key => key !== event.code);
            }
        });

        canvas.addEventListener(MouseEvents.MouseMove, event => {
            this.mouseAngle = Math.atan2(event.y - canvas.height / 2, event.x - canvas.width / 2) + Math.PI / 2;
        });
    }

    public getMouseAngle(): number {
        return this.mouseAngle;
    }

    public isKeyDown(key: Keys): boolean {
        return this.keysDown.includes(key);
    }

    public isOneOfKeysDown(keys: Keys[]): boolean {
        return keys.some(key => this.keysDown.includes(key));
    }

    public isKeyboardEvent = (event: unknown): event is KeyboardEvent => {
        return (event as KeyboardEvent).code !== undefined;
    };

    public isMouseEvent = (event: unknown): event is MouseEvent => {
        return (event as MouseEvent).button !== undefined;
    };

    /**
     * add a listener to an event
     * @param eventName event name from the InputEvents enum
     * @param key a key from the Keys enum
     * @param cb a callback function to call when the event is triggered
     * @returns eventId
     */
    public on(
        eventName: KeyboardOrMouseEventNames,
        key: Keys | null,
        cb: callback,
        options: InputEventOptions = {},
    ): string {
        const eventListener = (event: KeyboardOrMouseEvent): void => {
            const { triggerWhenGamePaused } = options;

            if (triggerWhenGamePaused || this.shouldEventsTrigger()) {
                if (this.isKeyboardEvent(event) && event.code === key) {
                    cb();
                } else if (this.isMouseEvent(event) && (!key || (key && event.button === (key as number)))) {
                    cb();
                }
            }
        };

        const eventId = generateId();
        this.eventListeners.set(eventId, eventListener);
        this.canvas.addEventListener(eventName, eventListener);
        return eventId;
    }

    public off(eventId: string): void {
        this.eventListeners.delete(eventId);
    }
}
