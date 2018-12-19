import { Player } from './player';
import { Deck } from './deck';
import { Injectable } from "@angular/core";

@Injectable()
export class Match{
    
    constructor(public datetime: string,
        public deck1: Deck, 
        //public deck1Name: string,
        public deck1Result: string, 
        public deck2: Deck, 
        //public deck2Name,
        public deck2Result: string,
        public player1: Player,
        public player2: Player,
        public id = null) {
    }
}