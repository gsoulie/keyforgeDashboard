import { AngularFireAuth } from 'angularfire2/auth';
import { Match } from './../../models/match';
import { ToolsProvider } from './../tools/tools';
import { Deck } from './../../models/deck';
import { Player } from './../../models/player';
import { Injectable } from '@angular/core';
import { cst } from '../../models/constantes';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {

  players: Player[] = [];
  decks: Deck[] = [];
  matchs: Match[] = [];
  dataList: AngularFireList<any>;
  dataset: Observable<any[]>;

  constructor(private tools: ToolsProvider,
    public afDB: AngularFireDatabase,
    private afAuth: AngularFireAuth) {   
      this.dataList = this.afDB.list(cst.TBL_PLAYER, ref => ref.orderByChild('nom'));
      this.dataList.valueChanges()
      .subscribe((res) => {
        this.players = res as any[];
        return this.players;
      });

      this.afDB.list(cst.TBL_DECK, ref => ref.orderByChild('deckName'))
      .valueChanges()
      .subscribe((res) => {
        this.decks = res as any[];
      });
/*
      this.afDB.list(cst.TBL_MATCH)
      .valueChanges()
      .subscribe((res) => {
        this.matchs = res as any[];
      });*/
  }

  log(title: string = "", message: string = ""){
      console.log("[--- " + title + " ---] " + message);
  }

  /**
   * Ajouter une donnée dans firebase
   * @param firebaseTable : nom de la table concernée (voir cst)
   * @param data : objet JSON à insérer
   */
  addFirebaseData(firebaseTable: string, data: any){
    if(firebaseTable){
      const firebaseRef = this.afDB.database.ref(firebaseTable).push({});
      data['id'] = firebaseRef.key; // ajout de l'attribut clé à l'objet JSON
      firebaseRef.set(data);   
    } else {
      console.log("[--- addFirebaseData ---] missing argument");
    }
  }


  /************************************************************************
  * 
  * PLAYER
  * 
  ***********************************************************************/

  getPlayers(){
    return this.players.sort(this.tools.predicateBy('nom'));
  }

  /**
   * Rechercher un joueur par nom
   * @param playerName 
   */
  getPlayerByName(playerName: string){
    let res = this.tools.arraySearch(playerName.toUpperCase(),this.players,"nom");
    if(res >= 0){
      return this.players[res];
    } else {
      return null;
    }
  }

  playerAlreadyExists(playerName: string){
    let res = this.tools.arraySearch(playerName.toUpperCase(),this.players,"nom")
    return res;
  }

  addNewPlayer(playerName: string){
    if(playerName !== ""){
      const firebaseRef = this.afDB.database.ref(cst.TBL_PLAYER).push({});
      let newPlayer = new Player(firebaseRef.key,playerName);
      firebaseRef.set(newPlayer);   
      this.players.push(newPlayer);
    } else {
      this.log("addPlayer","nom de joueur vide");
      return false;
    }
  }

  addNewSuggestion(suggestion: string){
    if(suggestion !== ""){
      const firebaseRef = this.afDB.database.ref(cst.TBL_SUGGESTIONS).push({});
      firebaseRef.set({id: firebaseRef.key,titre: suggestion, etat: false});   
    } else {
      this.log("addNewSuggestion","suggestion vide");
      return false;
    }
  }

  deletePlayer(player){
    let found = 0;
    if(player){
      // rechercher si des decks / games sont associés à ce joueur
      this.decks.forEach(deck => {
        if(deck.player.nom === player.nom){
          found = 1;
          return;
        }
      });

      if(found === 1){
        // joueur ayant au moins un deck associé
        console.log(player.nom + " a au moins un deck associé");
        return false;
      } else {
        console.log(player.nom + " peut être supprimé");
        // joueur n'ayant pas de deck associé, on peut le supprimer
        this.afDB.database.ref(cst.TBL_PLAYER + '/' + player.id).set(null);
        let index = this.tools.arraySearch(player.nom.toUpperCase(),this.players,"nom");
        console.log(index);
        if(index >= 0){
          this.players.splice(index,1);
        } else {
          console.log(player.nom + " n'a pas été trouvé " + index);
        }
        return true;
      }
    } else {
      console.log("--- deletePlayer --- joueur introuvable");
      return false;
    }
  }


  /************************************************************************
   * 
   * DECK
   * 
   ***********************************************************************/

  getDecks(){
    return this.decks.sort(this.tools.predicateBy('deckName'));
  } 

  /**
   * Ajotuer un nouveau deck
   * @param deck 
   */
  addNewDeck(deck: Deck, deckChain: number = 0){
    if(deck !== undefined){
      const firebaseRef = this.afDB.database.ref(cst.TBL_DECK).push({});
      deck.id = firebaseRef.key;
      deck.chain = deckChain;
      firebaseRef.set(deck);   
      this.decks.push(deck);
    }
  }

  deckAlreadyExists(deckName: string){
    let res = this.tools.arraySearch(deckName.toUpperCase(),this.decks,"deckName")
    return res;
  }

  updateDeck(deck: Deck){
    // Recherche du deck
    let index = this.tools.arraySearch(deck.deckName.toUpperCase(),this.decks,"deckName");
    console.log("[--- updateDeck ---] index = " + index + ' / ' + JSON.stringify(deck));
    // deck trouvé ?
    if(index >= 0){
      // oui, on le met à jour
      this.decks[index] = deck;
      this.afDB.database.ref(cst.TBL_DECK + '/' + deck.id).set({
        id: deck.id,
        deckName: deck.deckName,
        aombres: deck.aombres || 0,
        creatures: deck.creatures || 0,
        faction1: deck.faction1,
        faction2: deck.faction2,
        faction3: deck.faction3,
        player: deck.player,
        rares: deck.rares || 0,
        win: deck.win,
        loose: deck.loose,
        draw: deck.draw,
        nbGames: deck.nbGames,
        chain: deck.chain
      });

      // Mettre à jour tous les matchs associés
      this.updateMatchDeck(deck);
    } else {
      // deck non trouvé, on l'ajoute
      this.addNewDeck(deck);
    }
  }

  /****************************************************
   * 
   * MATCH
   * 
   ***************************************************/

   getMatchs(){
    return this.matchs.sort(this.tools.predicateBy("datetime")).reverse();
  }
  /**
   * Ajouter un nouveau match
   * @param deck1 
   * @param deck1Result 
   * @param deck2 
   * @param deck2Result 
   * @param player1 
   * @param player2 
   */
  addNewMatch(deck1: Deck, deck1Result: string, deck2: Deck, deck2Result: string, player1: Player, player2: Player){
    
    if(deck1 && deck2 && deck1Result && deck2Result && player1 && player2){
      const firebaseRef = this.afDB.database.ref(cst.TBL_MATCH).push({});
      let match = new Match(new Date().toDateString(),deck1,deck1Result,deck2,deck2Result,player1,player2)
      match.id = firebaseRef.key;
      firebaseRef.set(match);   
      this.matchs.push(match);

      // mise à jour des résultats pour les 2 decks
      switch(deck1Result){
        case cst.GAME_WIN :
          deck1.win++;
          break;
        case cst.GAME_LOOSE :
          deck1.loose++;
          break;
        case cst.GAME_DRAW :
          deck1.draw++;
          break;
        default :
          break;
      }
      deck1.nbGames++;

      this.updateDeck(deck1);

      switch(deck2Result){
        case cst.GAME_WIN :
          deck2.win++;
          break;
        case cst.GAME_LOOSE :
          deck2.loose++;
          break;
        case cst.GAME_DRAW :
          deck2.draw++;
          break;
        default :
          break;
      }
      deck2.nbGames++;
      this.updateDeck(deck2);

    } else {
      console.log("[--- addNewMatch ---] argument manquant");
    }
  }

  /**
   * Supprimer un match
   * @param match 
   */
  deleteMatch(match: Match){
    this.afDB.database.ref(cst.TBL_MATCH + '/' + match.id).set(null);
    let index = this.tools.arraySearch2(match.id,this.matchs,"id");
    
    // mise à jour des résultats pour les 2 decks
    switch(match.deck1Result){
      case cst.GAME_WIN :
        match.deck1.win--;
        break;
      case cst.GAME_LOOSE :
        match.deck1.loose--;
        break;
      case cst.GAME_DRAW :
        match.deck1.draw--;
        break;
      default :
        break;
    }
    match.deck1.nbGames--;

    this.updateDeck(match.deck1);

    switch(match.deck2Result){
      case cst.GAME_WIN :
        match.deck2.win--;
        break;
      case cst.GAME_LOOSE :
        match.deck2.loose--;
        break;
      case cst.GAME_DRAW :
        match.deck2.draw--;
        break;
      default :
        break;
    }
    match.deck2.nbGames--;
    this.updateDeck(match.deck2);

    if(index >= 0){
      this.matchs.splice(index,1);
    } else {
      console.log("match introuvable " + JSON.stringify(match));
    }
  }
  
  /**
   * Mettre à jour les decks en cas de mise à jour de ces derniers
   * @param deck 
   */
  updateMatchDeck(deck: Deck){
    this.matchs.forEach(match => {
      if(match.deck1.id === deck.id){
        match.deck1 = deck;
        this.afDB.database.ref(cst.TBL_MATCH + '/' + match.id).set({
          id: match.id,
          datetime: match.datetime,
          deck1: deck,
          deck1Result: match.deck1Result,
          deck2: match.deck2,
          deck2Result: match.deck2Result,
          player1: match.player1,
          player2: match.player2
        });
      }
      if(match.deck2.id === deck.id){
        match.deck2 = deck;
        this.afDB.database.ref(cst.TBL_MATCH + '/' + match.id).set({
          id: match.id,
          datetime: match.datetime,
          deck1: match.deck1,
          deck2: deck,
          deck1Result: match.deck1Result,
          deck2Result: match.deck2Result,
          player1: match.player1,
          player2: match.player2
        });
      }
    })
  }
}
