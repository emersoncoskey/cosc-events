type EventHandler<T extends GameEvent> = (event: T) => void;

interface EventBusEntry<T extends GameEvent> {
    readonly eventBusIn: EventBus<T>,

    readonly target?: string,
    readonly key: symbol,
    readonly handler: EventHandler<T>,

    readonly unsubscribe: () => void,
}

/* ------- */

class EventBus<T, K extends T[keyof TEvent]> {
    readonly #handlers: Map<symbol, EventBusEntry<T>>;

    constructor() {
        this.#handlers = new Map<symbol, EventBusEntry<T>>();
    }

    private getUnsubscribeFunction(key: symbol): () => void {
        return () => {
            this.#handlers.delete(key);
        };
    }

    public emit(event: T, target?: string): void {
        this.#handlers.forEach((entry, key) => {
            if (target === undefined || key.description === undefined || target === key.description) {
                entry.handler(event);
            }
        })
    }

    public subscribe(handler: EventHandler<T>, target?: string): EventBusEntry<T> {
        const key = Symbol(target);
        const unsubscribeFunction = this.getUnsubscribeFunction(key);
        const entry = {
            eventBusIn: this, 
            target: target,
            key: key, 
            handler: handler, 
            unsubscribe: unsubscribeFunction,
        };

        this.#handlers.set(key, entry);

        return entry;
    }
}

export default class GameAPI {
    readonly exampleEventBus: EventBus<WorldObjectMove> = new EventBus<WorldObjectMove>();
    //TODO: constructor, add event buses, add forwarding of events

    //event containers to send target, or just parse from event???
    //probably container with target and things ?????????????????????????
    private static emit(event: GameEvent): void {

    }

    static subscribe<T extends GameEvent>(handler: (event: T) => void): void {
        console.log(typeof handler);
    }
}