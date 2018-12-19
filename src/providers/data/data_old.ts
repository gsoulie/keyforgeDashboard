import { AngularFireAuth } from 'angularfire2/auth';
import { Match } from '../../models/match';
import { ToolsProvider } from '../tools/tools';
import { Deck } from '../../models/deck';
import { Player } from '../../models/player';
//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cst } from '../../models/constantes';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class DataOldProvider {

  players: Player[] = [];
  decks: Deck[] = [];
  matchs: Match[] = [];
  user;
  dataList: AngularFireList<any>;
  dataset: Observable<any[]>;

  constructor(private tools: ToolsProvider,
    public afDB: AngularFireDatabase,
    private afAuth: AngularFireAuth) {
      //this.user = this.afAuth.auth.currentUser.uid;

      this.dataList = this.afDB.list(cst.TBL_PLAYER,ref => ref.orderByChild('nom'));
      this.dataset = this.dataList.valueChanges();
      this.dataset.subscribe((res) => {
        let temp = res as any[];
        temp.forEach(element => {
          this.players.push(new Player(element.id,element.nom));
        });
      });      
  }

  //[-------------- PLAYERS --------------]
  getPlayers(){
    /*this.players = [];
    console.log("players " + JSON.stringify(this.players.sort(this.tools.predicateBy("nom"))));
    this.dataList = this.afDB.list(cst.TBL_PLAYER,ref => ref.orderByChild('nom'));
      this.dataset = this.dataList.valueChanges();
      this.dataset.subscribe((res) => {
        let temp = res as any[];
        temp.forEach(element => {
          this.players.push(new Player(element.id,element.nom));
        });
      });      

    return this.players.sort(this.tools.predicateBy("nom"));
    */
    this.dataList = this.afDB.list(cst.TBL_PLAYER,ref => ref.orderByChild('nom'));
    this.dataset = this.dataList.valueChanges();
    return this.dataset;
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

  /**
   * Ajouter un nouveau joueur
   * @param playerName 
   */
  addNewPlayer(playerName: string){
    if(playerName !== ""){
      /*const firebaseRef = this.afDB.database.ref(cst.TBL_PLAYER).push({});
      
      firebaseRef.set({
        id: firebaseRef.key,
        nom: playerName
      });   */
      this.addFirebaseData(cst.TBL_PLAYER,{nom: playerName});
     // this.players.push(new Player(firebaseRef.key,playerName));
    }
  }

  /**
   * Vérifier si un joueur existe déjà en base
   * @param playerName 
   */
  playerAlreadyExists(playerName: string){
    let res = this.tools.arraySearch(playerName.toUpperCase(),this.players,"nom")
    return res;
  }

  /**
   * Supprimer un joueur
   * @param player 
   */
  deletePlayer(player: Player){
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
        /*let index = this.tools.arraySearch(player.nom.toUpperCase(),this.players,"nom");
        console.log(index);
        if(index >= 0){
          this.players.splice(index,1);
        } else {
          console.log(player.nom + " n'a pas été trouvé " + index);
        }*/
        return true;
      }
    } else {
      console.log("--- deletePlayer --- joueur introuvable");
      return false;
    }
  }


  //[-------------- DECK --------------]
  getDecks(){
    /*this.dataList = this.afDB.list(cst.TBL_DECK,ref => ref.orderByChild('deckName'));
    this.dataset = this.dataList.valueChanges();
    this.dataset.subscribe((res) => {
      let temp = res as any[];
      temp.forEach(element => {
        this.decks.push(new Deck(element.deckname,
          element.aombres,
          element.creatures,
          element.rares,
          element.fatcion1,
          element.faction2,
          element.faction3,
          element.player,
          element.id))
      });
    });      
    console.log("decks " + JSON.stringify(this.decks));
    return this.decks.sort(this.tools.predicateBy("deckName"));*/
  }

  /**
   * Obtenir la liste des decks
   */
  getDecksObservable(){
    this.dataList = this.afDB.list(cst.TBL_DECK,ref => ref.orderByChild('deckName'));
    this.dataset = this.dataList.valueChanges();
    this.dataset.subscribe((res) => {
      this.decks = res as any[];
    })
    return this.dataList.valueChanges();

  }

  /**
   * Ajotuer un nouveau deck
   * @param deck 
   */
  addNewDeck(deck: Deck){
    if(deck !== undefined){
      console.log("ajout du deck " +JSON.stringify(deck));
      //this.decks.push(deck);
      deck['playerName'] = deck.player.nom;
      this.addFirebaseData(cst.TBL_DECK,deck);
    }
  }

  /**
   * Contrôler l'existence d'un deck
   * @param deckName 
   */
  deckAlreadyExists(deckName: string){
    let res = this.tools.arraySearch(deckName.toUpperCase(),this.decks,"deckName");
    return res;
  }

  /**
   * Mettre à jour un deck
   * @param deck 
   */
  updateDeck(deck: Deck){
    // Recherche du deck
    let index = this.tools.arraySearch(deck.deckName.toUpperCase(),this.decks,"deckName");
    console.log("[--- updateDeck ---] index = " + index + ' / ' + JSON.stringify(deck));
    // deck trouvé ?
    if(index >= 0){
      // oui, on le met à jour
      //this.decks[index] = deck;
      let ref = this.afDB.database.ref(cst.TBL_DECK + '/' + deck.id).set({
        id: deck.id,
        deckName: deck.deckName,
        aombres: deck.aombres,
        creatures: deck.creatures,
        faction1: deck.faction1,
        faction2: deck.faction2,
        faction3: deck.faction3,
        player: deck.player,
        rares: deck.rares
      });
    } else {
      // deck non trouvé, on l'ajoute
      this.addNewDeck(deck);
    }
  }

  //[-------------- MATCH --------------]
  getMacths(){
    /*let matchComplet = [];
    this.matchs.forEach(match => {
      let index = this.tools.arraySearch(match.deck1Name.toUpperCase(),this.decks,"deckName");
      let deck1 = null;
      let deck2 = null;
      if(index >= 0){
        deck1 = this.decks[index];
      }

      index = this.tools.arraySearch(match.deck2Name.toUpperCase(),this.decks,"deckName");
      if(index >= 0){
        deck2 = this.decks[index];
      }

      matchComplet.push({datetime: match.datetime,
        deck1: deck1,
        deck2: deck2,
        deck1Result: match.deck1Result,
        deck2Result: match.deck2Result,
        player1: match.player1,
        player2: match.player2
      });
    });
    return matchComplet.sort(this.tools.predicateBy("datetime")).reverse();*/
  }

  getMatchObservable(){
    let matchsComplets = [];
    this.dataList = this.afDB.list(cst.TBL_MATCH,ref => ref.orderByChild('datetime'));
    this.dataset = this.dataList.valueChanges();
    return this.dataset;
    /*return this.dataset.subscribe((res) => {
      let temp = res as any[];
      temp.forEach(match => {
        let index = this.tools.arraySearch(match.deck1Name.toUpperCase(),this.decks,"deckName");
        let deck1 = null;
        let deck2 = null;
        if(index >= 0){
          deck1 = this.decks[index];
        }
  
        index = this.tools.arraySearch(match.deck2Name.toUpperCase(),this.decks,"deckName");
        if(index >= 0){
          deck2 = this.decks[index];
        }
  
        matchsComplets.push({datetime: match.datetime,
          deck1: deck1,
          deck2: deck2,
          deck1Result: match.deck1Result,
          deck2Result: match.deck2Result,
          player1: match.player1,
          player2: match.player2
        });
        return matchsComplets;
      });
      //this.matchs = res as any[];
    })*/
    //return matchsComplets;//this.dataList.valueChanges();

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
    /*if(deck1 && deck2 && deck1Result && deck2Result && player1 && player2){
      this.matchs.push(new Match(new Date(),deck1.deckName,deck1Result,deck2.deckName,deck2Result,player1,player2));
    } else {
      console.log("[--- addNewMatch ---] argument manquant");
    }*/

    /*if(deck1 && deck2 && deck1Result && deck2Result && player1 && player2){
      let match = new Match(new Date(),deck1.deckName,deck1Result,deck2.deckName,deck2Result,player1,player2)
      this.addFirebaseData(cst.TBL_MATCH,match);
    } else {
      console.log("[--- addNewMatch ---] argument manquant");
    }*/
  }

  /**
   * Supprimer un match
   * @param match 
   */
  deleteMatch(match: Match){
    // Recherche du match
    /*let index = this.tools.arraySearch2(match.id,this.matchs,"id");
    console.log("index = " + index + " " + JSON.stringify(match));

    // match trouvé ?
    if(index >= 0){
      this.matchs.splice(index,1);
    }*/
    if(match){
      this.afDB.database.ref(cst.TBL_MATCH + '/' + match.id).set(null);
    } else {
      console.log("[--- deleteMatch ---] argument manquant");
    }
  }

}
