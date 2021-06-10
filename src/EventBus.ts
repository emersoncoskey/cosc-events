type EventHandler<T> = (event: T) => void;

interface EventBusEntry<T, K> {
    readonly eventBusIn: EventBus<T, K>,

    readonly key: symbol,
    readonly target?: K,
    readonly handler: EventHandler<T>,

    readonly unsubscribe: () => void,
}

class EventBus<T, K = undefined> {
    readonly #handlers: Map<symbol, EventBusEntry<T, K>>;
    readonly #targetFunc: (event: T) => K;
    /*readonly #isOverrideFunc?: (event: T) => boolean*/

    constructor(targetFunc: (event: T) => K/*, isOverrideFunc?: (event: T) => boolean */) {
        this.#handlers = new Map<symbol, EventBusEntry<T, K>>();
        this.#targetFunc = targetFunc;
        /*this.#isOverrideFunc = isOverrideFunc;*/
    }

    private getUnsubscribeFunction(key: symbol): () => void {
        return () => {
            this.#handlers.delete(key);
        };
    }

    public emit(event: T): void {
        const target: K = this.#targetFunc(event);
        /*const isOverride: boolean = this.#isOverrideFunc ? this.#isOverrideFunc(event) : false;*/

        this.#handlers.forEach((handlersEntry) => {
            if (/*isOverride || */handlersEntry.target === undefined || target === handlersEntry.target) {
                handlersEntry.handler(event);
            }
        });
    }

    public on(handler: EventHandler<T>, target?: K): EventBusEntry<T, K> {
        const key = Symbol();
        const unsubscribeFunction = this.getUnsubscribeFunction(key);
        const entry = {
            eventBusIn: this, 
            key: key, 
            target: target,
            handler: handler, 
            unsubscribe: unsubscribeFunction,
        };

        this.#handlers.set(key, entry);

        return entry;
    }

    public once(handler: EventHandler<T>, target: K): EventBusEntry<T, K> {
        const key = Symbol();
        const unsubscribeFunction = this.getUnsubscribeFunction(key);
        const entry = {
            eventBusIn: this,
            key: key,
            target: target,
            handler: (event: T) => {
                handler(event);
                unsubscribeFunction();
            }, 
            unsubscribe: unsubscribeFunction,
        };

        this.#handlers.set(key, entry);

        return entry;
    }

    public clear(): void {
        this.#handlers.clear();
    }
}


/*export default class GameAPI {
    readonly exampleEventBus: EventBus<WorldObjectMove> = new EventBus<WorldObjectMove>();
    //TODO: constructor, add event buses, add forwarding of events

    //event containers to send target, or just parse from event???
    //probably container with target and things ?????????????????????????
    private static emit(event: GameEvent): void {

    }

    static subscribe<T extends GameEvent>(handler: (event: T) => void): void {
        console.log(typeof handler);
    }
}*/