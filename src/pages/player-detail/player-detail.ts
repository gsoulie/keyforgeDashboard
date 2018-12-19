import { ToolsProvider } from './../../providers/tools/tools';
import { DataProvider } from '../../providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Player } from '../../models/player';
import { NgForm } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-player-detail',
  templateUrl: 'player-detail.html',
})
export class PlayerDetailPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private tools: ToolsProvider,
    private dataService: DataProvider,
    public toastCtrl: ToastController) {
  }

  onAddPlayer(f: NgForm){
    if(f.value.playerName === ""){
      return;
    }

    this.dataService.addNewPlayer(f.value.playerName)
    f.reset();

    /*if(this.dataService.playerAlreadyExists(f.value.playerName) < 0){
      this.dataService.addNewPlayer(f.value.playerName);
      this.toastCtrl.create({
        message: "Le joueur " + f.value.playerName + " a bien été ajouté",
        duration: 3000
      }).present();
      f.reset();
    } else {
      this.tools.showAlert("Joueur existant","Le joueur " + f.value.playerName + " existe déjà dans la base");
    }
*/
  }

  ionViewWillLeave(){
    if(this.navParams.get("callback")){
      this.navParams.get("callback")();
    }
  }

}
