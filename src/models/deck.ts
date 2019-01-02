import { Player } from './player';
import { Injectable } from "@angular/core";

@Injectable()

export class Deck{
    
    constructor(public deckName: string,
                public aombres: number = 0,
                public creatures: number = 0,
                public rares: number = 0,
                public faction1: any,
                public faction2: any,
                public faction3: any,
                public player: Player,
                public id,
                public win: number = 0,
                public loose: number = 0,
                public draw: number = 0,
                public nbGames: number = 0,
                public chain: number = 0) {
    }
}
