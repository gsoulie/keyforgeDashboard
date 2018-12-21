import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from './../../providers/data/data';
import { Player } from './../../models/player';
import { ToolsProvider } from './../../providers/tools/tools';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { cst } from '../../models/constantes';
import { Deck } from '../../models/deck';

@IonicPage()
@Component({
  selector: 'page-deck-new',
  templateUrl: 'deck-new.html',
})
export class DeckNewPage {

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

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public tools: ToolsProvider,
    public afDB: AngularFireDatabase,
    public toastCtrl: ToastController,
    private dataService: DataProvider) {
      this.players = this.dataService.getPlayers();
  }

  onAddNewDeck(/*f: NgForm*/){
    // check si 3 factions sont sélectionnées
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

    if(this.deckName === ""){
      this.tools.showAlert("Nom de deck manquant","Vous devez saisir un nom pour le deck");
      return;
    }

    console.log("selected " + this.selectedPlayer.nom);
    if(this.selectedPlayer === undefined){
      this.tools.showAlert("Joueur manquant","Vous devez sélectionner un joueur");
      return;
    }
    
    if(selectedFactions.length !== 3){
      this.tools.showAlert("Erreur de faction","Vous devez sélectionner 3 factions");
      return;
    }

    // Ajouter le deck s'il n'existe pas encore
    if(this.dataService.deckAlreadyExists(this.deckName) < 0){
      this.dataService.addNewDeck(new Deck(this.deckName,this.deckAmber,this.deckCreatures,
        this.deckRares,
        selectedFactions[0].faction,
        selectedFactions[1].faction,
        selectedFactions[2].faction,
        this.selectedPlayer,
        null));
      
      this.toastCtrl.create({
        message: "Le deck " + this.deckName + " a bien été ajouté",
        duration: 3000
      }).present();

      this.resetField();
    } else {
      this.tools.showAlert("Deck déjà existant","Le deck " + this.deckName + " existe déjà dans la base");
      return;
    }
  }

  resetField(){
    this.selectedPlayer = null;
    this.deckAmber = null;
    this.deckCreatures = null;
    this.deckName = "";
    this.deckRares = null;
    this.logoDis.selected = false;
    this.logoBrobnar.selected = false;
    this.logoLogos.selected = false;
    this.logoMars.selected = false;
    this.logoSanctum.selected = false;
    this.logoShadow.selected = false;
    this.logoUntamed.selected = false;
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
