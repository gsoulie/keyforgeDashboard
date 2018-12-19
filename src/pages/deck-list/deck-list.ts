import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { cst } from './../../models/constantes';
import { DataProvider } from '../../providers/data/data';
import { Deck } from './../../models/deck';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { DeckNewPage } from '../deck-new/deck-new';
import { DeckDetailPage } from '../deck-detail/deck-detail';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-deck-list',
  templateUrl: 'deck-list.html',
})
export class DeckListPage implements OnInit{

  logoDis: any = {selected: false, faction: cst.FACTION_DIS};
  logoBrobnar: any = {selected: false, faction: cst.FACTION_BROBNAR};
  logoLogos: any = {selected: false, faction: cst.FACTION_LOGOS};
  logoMars: any = {selected: false, faction: cst.FACTION_MARS};
  logoSanctum: any = {selected: false, faction: cst.FACTION_SANCTUM};
  logoShadow: any = {selected: false, faction: cst.FACTION_SHADOW};
  logoUntamed: any = {selected: false, faction: cst.FACTION_UNTAMED};
  dataList: AngularFireList<any>;
  decks: Observable<any[]>;
  playerList: AngularFireList<any>;
  players: Observable<any[]>;
  comboPlayer: any[] = [];
  selectedPlayer: string = "";
  deckArray: any[] = [];
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public afDB: AngularFireDatabase) {
  }

  ngOnInit(){
    this.getDecks();
  }
  getDecks(){
    const loader = this.loadingCtrl.create({
      content: "Chargement des parties..."
    });
    loader.present();
    this.dataList = this.afDB.list(cst.TBL_DECK, ref => ref.orderByChild('deckName'));
    this.decks = this.dataList.valueChanges();

    this.playerList = this.afDB.list(cst.TBL_PLAYER, ref => ref.orderByChild('nom'));
    this.players = this.playerList.valueChanges();
    this.players.subscribe((res) => {
      this.comboPlayer = res as any[];
      this.comboPlayer.push({nom: "Tous"});
    })
    try{
      this.decks.subscribe((res) => {
          //this.deckArray = res as any[];
          loader.dismiss();        
      });
    } catch(e){
      loader.dismiss();
    }
  }

  filteringItem(ev){
    // set searchText to the value of the searchbar
    var searchText = ev;

    // Avoid research if searchtext is empty
    if (!searchText || searchText.trim() === '' || searchText === 'Tous') {
      this.decks = this.dataList.valueChanges();
      return;
    }
    
    this.decks = this.dataList.valueChanges().map(items => items.filter((deck) => {
      console.log("deck " + deck.deckName + " / " + deck.player.nom);
      if (deck.player.nom.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        return true;
      }
      return false;
    }));
  }

  onAddNewDeck(){
    this.navCtrl.push(DeckNewPage);
  }

  onOpenDeckDetail(selectedDeck: Deck){
    this.navCtrl.push(DeckDetailPage,{deckDetail:selectedDeck,callback: () => {}})
  }

}
