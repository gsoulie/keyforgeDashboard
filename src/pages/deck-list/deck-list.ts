import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { cst } from './../../models/constantes';
import { Deck } from './../../models/deck';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { DeckNewPage } from '../deck-new/deck-new';
import { DeckDetailPage } from '../deck-detail/deck-detail';
import { Observable } from 'rxjs';

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

  /**
   * Charger la liste de decks
   */
  getDecks(){
    const loader = this.loadingCtrl.create({
      content: "Chargement des parties..."
    });
    loader.present();

    this.dataList = this.afDB.list(cst.TBL_DECK, ref => ref.orderByChild('deckName'));  // Récupération des decks dans Firebase
    this.decks = this.dataList.valueChanges();

    this.playerList = this.afDB.list(cst.TBL_PLAYER, ref => ref.orderByChild('nom')); // Récupération de la liste des joueurs dans Firebase
    this.players = this.playerList.valueChanges();

    // Alimentation de la combo des joueurs
    this.players.subscribe((res) => {
      this.comboPlayer = res as any[];
      this.comboPlayer.push({nom: "Tous"});
    });

    try{
      this.decks.subscribe((res) => {
          loader.dismiss();        
      });
    } catch(e){
      loader.dismiss();
    }
  }

  /**
   * Filtrer les decks par joueur
   * @param ev 
   */
  filteringItem(ev){
    // Texte cherché
    var searchText = ev;

    // Si recherche vide, afficher tous les decks
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

  /**
   * Ouverture détail d'un deck
   * @param selectedDeck 
   */
  onOpenDeckDetail(selectedDeck: Deck){
    this.navCtrl.push(DeckDetailPage,{deckDetail:selectedDeck,callback: () => {}})
  }

  /**
   * Gestion du lien vers keyforge-compendium (attention si deck non scanné, keyforge-compendium ne retournera pas de stat)
   * @param event 
   * @param deckName 
   */
  onAnalyzeDeck(event,deckName){
    if(deckName){
      let usrlStart = "https://keyforge-compendium.com/decks?utf8=%E2%9C%93&filterrific%5Bwith_deck_name%5D=";
      let urlEnd = '&commit=Search&filterrific%5Bwith_card_ids%5D%5B%5Dcard_id=&filterrific%5Bwith_card_ids%5D%5B%5Dcard_type=%3E%3D&filterrific%5Bwith_card_ids%5D%5B%5Dcard_count=1&filterrific%5Bwith_adhd%5Da_rating=&filterrific%5Bwith_adhd%5Da_type=%3E&filterrific%5Bwith_adhd%5Db_rating=&filterrific%5Bwith_adhd%5Db_type=%3E&filterrific%5Bwith_adhd%5Dc_rating=&filterrific%5Bwith_adhd%5Dc_type=%3E&filterrific%5Bwith_adhd%5De_rating=&filterrific%5Bwith_adhd%5De_type=%3E&filterrific%5Bwith_adhd%5Dconsistency_rating=&filterrific%5Bwith_adhd%5Dconsistency_type=%3E&filterrific%5Bwith_card_count%5Dcreature_count=&filterrific%5Bwith_card_count%5Dcreature_type=%3E&filterrific%5Bwith_card_count%5Daction_count=&filterrific%5Bwith_card_count%5Daction_type=%3E&filterrific%5Bwith_card_count%5Dartifact_count=&filterrific%5Bwith_card_count%5Dartifact_type=%3E&filterrific%5Bwith_card_count%5Dupgrade_count=&filterrific%5Bwith_card_count%5Dupgrade_type=%3E&filterrific%5Bwith_rare_count%5Dcount=&filterrific%5Bwith_rare_count%5Dtype=%3E%3D&filterrific%5Bwith_common_count%5Dcount=&filterrific%5Bwith_common_count%5Dtype=%3E%3D&filterrific%5Bwith_uncommon_count%5Dcount=&filterrific%5Bwith_uncommon_count%5Dtype=%3E%3D&filterrific%5Bwith_fixed_count%5Dcount=&filterrific%5Bwith_fixed_count%5Dtype=%3E%3D&filterrific%5Bwith_variant_count%5Dcount=&filterrific%5Bwith_variant_count%5Dtype=%3E%3D&filterrific%5Bby_house%5D%5Border_type%5D=Includes';
      let url = usrlStart + encodeURIComponent(deckName) + urlEnd;
      window.open(url,'_system','location=yes');
    }
    event.stopPropagation();
  }

  onOpenDeckSAS(event, deckName){
    if(deckName){
      let usrlStart = "https://decksofkeyforge.com/decks?title=";
      let url = usrlStart + encodeURIComponent(deckName);
      window.open(url,'_system','location=yes');
    }
    event.stopPropagation();
  }

}
