import { cst } from './../../models/constantes';
import { ToolsProvider } from './../../providers/tools/tools';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { cards } from '../../models/cards';

@Component({
  selector: 'page-card-list',
  templateUrl: 'card-list.html',
})
export class CardListPage {

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private tools: ToolsProvider) {
      this.cardsTemp = cards.sort(this.tools.predicateBy("card_number"));
      this.cardList = this.cardsTemp;
  }


  onFilteringCard(ev: any) {

    var searchText = ev.value;
    // Avoid research if searchtext is empty
    if (!searchText || searchText.trim() === '') {
      this.cardList = this.cardsTemp;
    } else {
      this.cardList = this.cardsTemp.filter((v) => {
        if (v.house.toLowerCase() === searchText.toLowerCase() || v.card_number == searchText || v.card_title.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
          return true;
        }
        return false;
      });
    }
  }

  /**
   * Sélection d'une faction
   * @param selectedFaction
   */
  onSelect(selectedFaction) {
    this.onResetHouse();
    if(selectedFaction){
      selectedFaction.selected = !selectedFaction.selected;
      // Filtrage sur la maison sélectionnée
      this.onFilteringCard({value:selectedFaction.faction.name});
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
  }

  onResetFilter() {
    this.searchTerm = "";
    this.onResetHouse();
    this.onFilteringCard({value:""});
  }

}
