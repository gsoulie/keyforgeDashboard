import { Player } from './../../models/player';
import { ToolsProvider } from './../../providers/tools/tools';
import { DataProvider } from '../../providers/data/data';
import { Deck } from './../../models/deck';
import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { cst } from '../../models/constantes';

@IonicPage()
@Component({
  selector: 'page-match-new',
  templateUrl: 'match-new.html',
})
export class MatchNewPage {

  decks: Deck[] = [];
  deck1 = null;
  deck2 = null;
  resWinDeck1 = null;
  resWinDeck2 = null;
  resDraw;
  resStatus: string [] = [];
  players: Player[] = [];
  selectedPlayer;
  player1: Player = null;
  player2: Player = null;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private dataService: DataProvider,
    private tools: ToolsProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
      this.decks = this.dataService.getDecks();
      this.players = this.dataService.getPlayers();      
      this.resStatus = [cst.GAME_WIN,cst.GAME_LOOSE,cst.GAME_DRAW];
  }
  onAddNewMatch(){
    // vérifier que 2 decks sont sélectionnés
    if(this.deck1 && this.deck2){

    } else {
      this.tools.showAlert("Saisie incomplète","Vous devez sélectionner 2 decks");
      return;
    }

    // Vérifier que les 2 joueurs sont sélectionnés
    if(this.player1 && this.player2){

    } else {
      this.tools.showAlert("Saisie incomplète","Vous devez sélectionner 2 joueurs");
      return;
    }

    // vérifier que le résultat du match est renseigné
    if(this.resWinDeck1 !== null && this.resWinDeck1 !== null){

    } else {
      this.tools.showAlert("Saisie incomplète","Vous devez saisir le résultat du match");
      return;
    }

    // Ajout du match
    this.dataService.addNewMatch(this.deck1,this.resWinDeck1,this.deck2, this.resWinDeck2,this.player1,this.player2);
    this.toastCtrl.create({
      message: "Le match a bien été ajouté",
      duration: 3000
    }).present();

    this.deck1 = null;
    this.deck2 = null;
    this.resWinDeck1 = null;
    this.resWinDeck2 = null;
    this.player1 = null;
    this.player2 = null;
  }

  /**
   * 
   * @param activeDeck : prend la valeur 1 ou 2
   */
  onChooseDeck(activeDeck){
    let alertPopup = this.alertCtrl.create()
    alertPopup.setTitle('Sélectionnez un deck');
    if(this.decks){

      this.decks.forEach(deck => {
        alertPopup.addInput({
          type: 'radio',
          value: deck.deckName,
          label: deck.deckName,
          checked: false
        })      
      });
  
      alertPopup.addButton('Annuler');
      alertPopup.addButton({
        text: 'Sélectionner',
        handler: data => {
          if(data){
            let index = this.tools.arraySearch(data.toUpperCase(),this.decks,"deckName");
            if(activeDeck === 1){
              this.deck1 = (index >= 0) ? this.decks[index] : null;
            } else {
              this.deck2 = (index >= 0) ? this.decks[index] : null;
            }
          }
        }
      });
  
      alertPopup.present();
    }
  }

  /**
   * 
   * @param playerActif : prend la valeur 1 ou 2
   */
  onChoosePlayer(activePlayer){
    let alertPopup = this.alertCtrl.create()
    alertPopup.setTitle('Sélectionnez un joueur');
    this.players.forEach(player => {
      alertPopup.addInput({
        type: 'radio',
        value: player.nom,
        label: player.nom,
        checked: false
      })      
    });

    alertPopup.addButton('Annuler');
    alertPopup.addButton({
      text: 'Sélectionner',
      handler: data => {
        if(data){
          let index = this.tools.arraySearch(data.toUpperCase(),this.players,"nom");
          if(activePlayer === 1){
            this.player1 = (index >= 0) ? this.players[index] : null;
          } else {
            this.player2 = (index >= 0) ? this.players[index] : null;
          }
        }
      }
    });

    alertPopup.present();
  }

  onUpdateResDeck1(){
    if(this.resWinDeck1 === cst.GAME_WIN){
      this.resWinDeck2 = cst.GAME_LOOSE;
    }
    if(this.resWinDeck1 === cst.GAME_LOOSE){
      this.resWinDeck2 = cst.GAME_WIN;
    }
    if(this.resWinDeck1 === cst.GAME_DRAW){
      this.resWinDeck2 = cst.GAME_DRAW;
    }
  }

  onUpdateResDeck2(){
    if(this.resWinDeck2 === cst.GAME_WIN){
      this.resWinDeck1 = cst.GAME_LOOSE;
    }
    if(this.resWinDeck2 === cst.GAME_LOOSE){
      this.resWinDeck1 = cst.GAME_WIN;
    }
    if(this.resWinDeck2 === cst.GAME_DRAW){
      this.resWinDeck1 = cst.GAME_DRAW;
    }
  }

  ionViewWillLeave(){
    if(this.navParams.get("callback")){
      this.navParams.get("callback")();
    }
  }
}

