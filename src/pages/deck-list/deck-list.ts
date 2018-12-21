import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { cst } from './../../models/constantes';
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

  logoDis: any = {selected: false, faction: cst.FACTION_DIS, nb: 0};
  logoBrobnar: any = {selected: false, faction: cst.FACTION_BROBNAR, nb: 0};
  logoLogos: any = {selected: false, faction: cst.FACTION_LOGOS, nb: 0};
  logoMars: any = {selected: false, faction: cst.FACTION_MARS, nb: 0};
  logoSanctum: any = {selected: false, faction: cst.FACTION_SANCTUM, nb: 0};
  logoShadow: any = {selected: false, faction: cst.FACTION_SHADOW, nb: 0};
  logoUntamed: any = {selected: false, faction: cst.FACTION_UNTAMED, nb: 0};
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
    // Filtrage des decks du joueur sélectionné
    this.decks = this.dataList.valueChanges().map(items => items.filter((deck) => {
      if (deck.player.nom.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        return true;
      }
      return false;
    }));

    // Gestion des compteurs de faction
    this.resetFactionStat();
    this.decks.subscribe((res) => {
      let test = res as any[];
      test.forEach(d => {
        this.onStatFaction(d.faction1.name);
        this.onStatFaction(d.faction2.name);
        this.onStatFaction(d.faction3.name);        
      });
    });
  }

  /**
   * Remise à 0 des compteurs de faction
   */
  resetFactionStat(){
    this.logoDis.nb = 0;
    this.logoBrobnar.nb = 0;
    this.logoLogos.nb = 0;
    this.logoMars.nb = 0;
    this.logoSanctum.nb = 0;
    this.logoShadow.nb = 0;
    this.logoUntamed.nb = 0;
  }

  /**
   * Incrémentation des compteurs de faction
   * @param factionName 
   */
  onStatFaction(factionName){
    switch(factionName){
      case cst.FACTION_DIS.name :
        this.logoDis.nb++;
        break;
      case cst.FACTION_BROBNAR.name :
        this.logoBrobnar.nb++;
        break;
      case cst.FACTION_LOGOS.name :
        this.logoLogos.nb++;  
        break;
      case cst.FACTION_MARS.name :
        this.logoMars.nb++;
        break;
      case cst.FACTION_SANCTUM.name  :
        this.logoSanctum.nb++;
        break;
      case cst.FACTION_SHADOW.name :
        this.logoShadow.nb++;
        break;
      case cst.FACTION_UNTAMED.name :
        this.logoUntamed.nb++;
        break;
      default:
        break;
    }
  }

  onAddNewDeck(){
    this.navCtrl.push(DeckNewPage);
  }

  onOpenDeckDetail(selectedDeck: Deck){
    this.navCtrl.push(DeckDetailPage,{deckDetail:selectedDeck,callback: () => {}})
  }

}
