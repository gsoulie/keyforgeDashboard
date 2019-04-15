import { Network } from '@ionic-native/network'
import { cst } from './../../models/constantes';
import { ToolsProvider } from './../../providers/tools/tools';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { cards } from '../../models/cards';

@Component({
  selector: 'page-card-list',
  templateUrl: 'card-list.html',
})
export class CardListPage implements OnInit {

  networkStatusOnLine = true;
  disconnectSubscription;
  connectSubscription;
  cardList: any[] = [];
  cardsTemp: any[] = [];
  searchTerm: string = '';  // text from searchbar
  logoDis: any = {selected: false, faction: cst.FACTION_DIS};
  logoBrobnar: any = {selected: false, faction: cst.FACTION_BROBNAR};
  logoLogos: any = {selected: false, faction: cst.FACTION_LOGOS};
  logoMars: any = {selected: false, faction: cst.FACTION_MARS};
  logoSanctum: any = {selected: false, faction: cst.FACTION_SANCTUM};
  logoShadow: any = {selected: false, faction: cst.FACTION_SHADOW};
  logoUntamed: any = {selected: false, faction: cst.FACTION_UNTAMED};
  houseSelected = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private tools: ToolsProvider,
    private network: Network) {
      this.cardsTemp = cards.sort(this.tools.predicateBy("card_number"));
      //this.cardList = this.cardsTemp;
  }

  ngOnInit() {
    // watch network for a disconnection
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.networkStatusOnLine = false;
    });

    this.connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
       // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        this.networkStatusOnLine = true;
      }, 3000);
    });
  }

  onFilteringCard(ev: any, houseFilteringMode = false) {

    var searchText = ev.value;
    if(houseFilteringMode === false) {this.onResetHouse();}
    // Avoid research if searchtext is empty
    if (!searchText || searchText.trim() === '') {
      this.cardList = [];//this.cardsTemp;
    } else {
      if(this.networkStatusOnLine) {
        this.cardList = this.cardsTemp.filter((v) => {
          if(houseFilteringMode) {
            if(v.house.toLowerCase() === searchText.toLowerCase() && v.is_maverick == false) {
              return true;
            } else {
              return false;
            }
          } else {
            if ((v.house.toLowerCase() === searchText.toLowerCase() ||
                v.card_number == searchText ||
                 v.card_title.toLowerCase().indexOf(searchText.toLowerCase()) > -1) && v.is_maverick == false) {
              console.log('card - ' + v.house.toLowerCase() + ' - ' + v.card_number + ' - ' + v.card_title);
              console.log('card - ' + (v.house.toLowerCase() === searchText.toLowerCase()) + ' - ' + (v.card_number == searchText) + ' - ' + (v.card_title.toLowerCase().indexOf(searchText.toLowerCase()) > -1));
              return true;
            }
            return false;
          }
        });
      }
    }
  }

  /**
   * Sélection d'une faction
   * @param selectedFaction
   */
  onSelect(selectedFaction) {
    this.onResetHouse();
    this.houseSelected = true;
    if(selectedFaction){
      selectedFaction.selected = !selectedFaction.selected;
      // Filtrage sur la maison sélectionnée
      this.onFilteringCard({value:selectedFaction.faction.name}, true);
    }
  }

  onResetHouse() {
    this.logoBrobnar.selected = false;
    this.logoDis.selected = false;
    this.logoLogos.selected = false;
    this.logoMars.selected = false;
    this.logoMars.selected = false;
    this.logoSanctum.selected = false;
    this.logoShadow.selected = false;
    this.logoUntamed.selected = false;
    this.houseSelected = false;
  }

  onResetFilter() {
    this.searchTerm = "";
    this.onResetHouse();
    this.onFilteringCard({value:""}, true);
  }

}
