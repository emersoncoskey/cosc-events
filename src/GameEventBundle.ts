import * as Events from './GameEvents';

export type GameEvents = {
    [Property in keyof typeof Events]: typeof Events[Property]
}