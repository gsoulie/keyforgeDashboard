import { NgForm } from '@angular/forms';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { cst } from './../../models/constantes';
import { ToolsProvider } from './../../providers/tools/tools';
import { PlayerDetailPage } from './../player-detail/player-detail';
import { DataProvider } from '../../providers/data/data';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-players-list',
  templateUrl: 'players-list.html',
})
export class PlayersListPage implements OnInit {

  dataList: AngularFireList<any>;
  players: Observable<any[]>;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private tools: ToolsProvider,
    private afDB: AngularFireDatabase,
    private dataService: DataProvider) {
  }

  ngOnInit() {
    this.getPlayerList();
  }

  getPlayerList(){
    this.dataList = this.afDB.list(cst.TBL_PLAYER, ref => ref.orderByChild('nom'));
    this.players = this.dataList.valueChanges();
  }

  onAddNewPlayer(){
    this.navCtrl.push(PlayerDetailPage, {callback: () => {/*this.getPlayerList()*/}})
  }

  onDeletePlayer(selectedPlayer){
    if(this.dataService.deletePlayer(selectedPlayer) === true){
      this.getPlayerList();
    } else {
      this.tools.showAlert("Suppression impossible",selectedPlayer.nom + " ne peut pas être supprimé car un ou plusieurs decks lui sont associés");
    }
  }

  onAddPlayer(f: NgForm){
    if(f.value.playerName === ""){
      return;
    }

    this.dataService.addNewPlayer(f.value.playerName)
    f.reset();
  }

}
