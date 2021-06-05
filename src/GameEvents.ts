import { GlobalDirection } from "./Directions";

export type GameEvent = (
    //union of all possible game events
    WorldObjectMove
);

export type WithExpectedValue<T extends GameEvent, V> = T & {expected: V};

// Event Type declarations below; DON'T include anything added by the above utility types.

export interface WorldObjectMove {
    direction: GlobalDirection,
}

export interface WorldViewUpdate {
    
}