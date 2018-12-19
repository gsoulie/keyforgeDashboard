import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { MatchDetailPage } from './../match-detail/match-detail';
import { MatchNewPage } from './../match-new/match-new';
import { DataProvider } from '../../providers/data/data';
import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { cst } from '../../models/constantes';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  dataList: AngularFireList<any>;
  matchs: Observable<any[]>;
  deckList: AngularFireList<any>;
  deckObservable: Observable<any[]>;
  decks: any[] = [];

  constructor(public navCtrl: NavController,
    private dataService: DataProvider,
    public afDB: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
      this.getMatchs();
  }

  getMatchs(){
    this.dataList = this.afDB.list(cst.TBL_DECK, ref => ref.orderByChild('deckName'));
    this.deckObservable = this.dataList.valueChanges();
    this.deckObservable.subscribe((res) => {
      this.decks = res as any[];
      this.decks.push({deckName: "Tous"});
    })

    const loader = this.loadingCtrl.create({
      content: "Chargement des parties..."
    });
    loader.present();
    this.dataList = this.afDB.list(cst.TBL_MATCH, ref => ref.orderByChild('datetime'));
    this.matchs = this.dataList.valueChanges().map(items => items.sort().reverse());
    try{
      this.matchs.subscribe((res) => {
          loader.dismiss();        
      })
    } catch(e){
      loader.dismiss();
    }
    
  }

  filteringItem(ev){
    // set searchText to the value of the searchbar
    var searchText = ev;

    // Avoid research if searchtext is empty
    if (!searchText || searchText.trim() === '' || searchText === 'Tous') {
      this.matchs = this.dataList.valueChanges().map(items => items.sort().reverse());
      return;
    }
    
    this.matchs = this.dataList.valueChanges().map(items => items.filter((match) => {      
      if ((match.deck1.deckName.toLowerCase().indexOf(searchText.toLowerCase()) > -1) || (match.deck2.deckName.toLowerCase().indexOf(searchText.toLowerCase()) > -1)) {
        return true;
      }
      return false;
    }));
  }

  onAddNewMatch(){
    this.navCtrl.push(MatchNewPage,{callback: () => {this.getMatchs();}})
  }

  onOpenMatchDetail(match){
    this.navCtrl.push(MatchDetailPage,{match: match});
  }

  deleteMatch(selectedMatch){
    const confirm = this.alertCtrl.create({
      title: 'Suppression du match',
      message: 'Êtes-vous certain de vouloir supprimer le match ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.dataService.deleteMatch(selectedMatch);
            this.getMatchs();
          }
        }
      ]
    });
    confirm.present();
  }
}
