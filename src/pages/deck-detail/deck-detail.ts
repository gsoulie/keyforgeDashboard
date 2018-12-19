import { DataProvider } from '../../providers/data/data';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Player } from '../../models/player';
import { cst } from '../../models/constantes';
import { ToolsProvider } from '../../providers/tools/tools';
import { Deck } from '../../models/deck';


@IonicPage()
@Component({
  selector: 'page-deck-detail',
  templateUrl: 'deck-detail.html',
})
export class DeckDetailPage implements OnInit{
  logoDis: any = {selected: false, faction: cst.FACTION_DIS};
  logoBrobnar: any = {selected: false, faction: cst.FACTION_BROBNAR};
  logoLogos: any = {selected: false, faction: cst.FACTION_LOGOS};
  logoMars: any = {selected: false, faction: cst.FACTION_MARS};
  logoSanctum: any = {selected: false, faction: cst.FACTION_SANCTUM};
  logoShadow: any = {selected: false, faction: cst.FACTION_SHADOW};
  logoUntamed: any = {selected: false, faction: cst.FACTION_UNTAMED};
  players: Player[] = [];
  selectedPlayer;
  deckName: string = "";
  deckAmber: number = null;
  deckCreatures: number = null;
  deckRares: number = null;
  deckDetail: Deck;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public tools: ToolsProvider,
    public toastCtrl: ToastController,
    private dataService: DataProvider) {
      this.players = this.dataService.getPlayers();
      this.deckDetail = this.navParams.get("deckDetail");
      console.log("player " + this.deckDetail.player.nom);
      console.log("deck paramètre : " + JSON.stringify(this.deckDetail));
      
      let factionArray = [];
    
      factionArray.push(this.logoDis);
      factionArray.push(this.logoBrobnar);
      factionArray.push(this.logoLogos);
      factionArray.push(this.logoMars);
      factionArray.push(this.logoSanctum);
      factionArray.push(this.logoShadow);
      factionArray.push(this.logoUntamed);
      factionArray.forEach(item => {
        if(item.faction.name === this.deckDetail.faction1.name || 
          item.faction.name === this.deckDetail.faction2.name || 
          item.faction.name === this.deckDetail.faction3.name){
            item.selected = true;
          }
      });
  }

  ngOnInit(){
    this.selectedPlayer = this.deckDetail.player.nom;
  }

  onUpdateDeck(){
    // check si 3 factions sont sélectionnées
    let playerObject = null;
    let factionArray = [];
    let selectedFactions = [];
    factionArray.push(this.logoDis);
    factionArray.push(this.logoBrobnar);
    factionArray.push(this.logoLogos);
    factionArray.push(this.logoMars);
    factionArray.push(this.logoSanctum);
    factionArray.push(this.logoShadow);
    factionArray.push(this.logoUntamed);

    factionArray.forEach(element => {
      if(element.selected){
        selectedFactions.push(element)
      }
    });

    if(this.deckDetail.deckName === ""){
      this.tools.showAlert("Nom de deck manquant","Vous devez saisir un nom pour le deck");
      return;
    }

    console.log("selected " + this.selectedPlayer);
    if(this.selectedPlayer === undefined){
      this.tools.showAlert("Joueur manquant","Vous devez sélectionner un joueur");
      return;
    } else {
      playerObject = this.dataService.getPlayerByName(this.selectedPlayer);
    }
    
    if(selectedFactions.length !== 3){
      this.tools.showAlert("Erreur de faction","Vous devez sélectionner 3 factions");
      return;
    }
    

/*
    this.dataService.updateDeck(new Deck(this.deckDetail.deckName,this.deckDetail.aombres,this.deckDetail.creatures,
      this.deckDetail.rares,
      selectedFactions[0].faction,
      selectedFactions[1].faction,
      selectedFactions[2].faction,
      playerObject));*/

      console.log(JSON.stringify(playerObject));

      this.deckDetail.faction1 = selectedFactions[0].faction;
      this.deckDetail.faction2 = selectedFactions[1].faction;
      this.deckDetail.faction3 = selectedFactions[2].faction;
      this.deckDetail.player = playerObject;

    this.dataService.updateDeck(this.deckDetail);
      
    this.toastCtrl.create({
      message: "Le deck " + this.deckName + " a bien été mis à jour",
      duration: 3000
    }).present();
    this.navCtrl.pop();
  }

  onSelect(faction){
    if(faction){
      faction.selected = !faction.selected;
      console.log(faction.url + " " + faction.selected)
    }
  }
  
  ionViewWillLeave(){
    if(this.navParams.get("callback")){
      this.navParams.get("callback")();
    }
  }

}
