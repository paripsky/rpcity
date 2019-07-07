
export default abstract class EventEmitter<T> {
    private eventsDictionary: Map<string, Array<(params: T) => void>> = new Map();

    public on(eventName, callback: (params: T) => void) {
        this.eventsDictionary.get(eventName).push(callback);
    }

    public off(eventName, callbackToRemove: (params: T) => void) {
        const listeners = this.eventsDictionary.get(eventName);
        const listenersWithOutTheOneToRemove = listeners.filter((cb) => cb !== callbackToRemove);
        this.eventsDictionary.set(eventName, listenersWithOutTheOneToRemove);
    }

    public trigger(eventName, params: T) {
        this.eventsDictionary.get(eventName).forEach((listener) => listener(params));
    }
}
