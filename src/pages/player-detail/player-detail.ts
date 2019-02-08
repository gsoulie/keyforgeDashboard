import { DataProvider } from '../../providers/data/data';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-player-detail',
  templateUrl: 'player-detail.html',
})
export class PlayerDetailPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private dataService: DataProvider,
    public toastCtrl: ToastController) {
  }

  onAddPlayer(f: NgForm){
    if(f.value.playerName === ""){
      return;
    }

    this.dataService.addNewPlayer(f.value.playerName)
    f.reset();
  }

  ionViewWillLeave(){
    if(this.navParams.get("callback")){
      this.navParams.get("callback")();
    }
  }

}
