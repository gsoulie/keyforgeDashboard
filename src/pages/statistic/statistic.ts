import { ToolsProvider } from './../../providers/tools/tools';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { cst } from '../../models/constantes';


@IonicPage()
@Component({
  selector: 'page-statistic',
  templateUrl: 'statistic.html',
})
export class StatisticPage {
  deckList: AngularFireList<any>;
  decksObservable: Observable<any[]>;
  decks: any[] = [];
  comboDeck: any[] = [];
  stats: any[];
  selectedPlayer: string = "";

  constructor(public loadingCtrl: LoadingController, 
    public afDB: AngularFireDatabase,
    private tools: ToolsProvider) {
    this.getStats();
  }

  getStats(){
    const loader = this.loadingCtrl.create({
      content: "Chargement des parties..."
    });
    loader.present();
    try{
      this.deckList = this.afDB.list(cst.TBL_DECK, ref => ref.orderByChild('deckName'));
      this.decksObservable = this.deckList.valueChanges().map(items => items.sort(this.tools.predicateBy('win')).reverse());
      this.decksObservable.subscribe((res) => {
        this.decks = res as any[];
        this.comboDeck = this.decks;
        this.comboDeck.push({deckName: "Tous"});
        this.decks.forEach(deck => {
          let pourcentWin = 0;
          let pourcentLoose = 0;
          let pourcentDraw = 0;
    
          if(deck.nbGames > 0){
            pourcentWin = deck.win * (100/deck.nbGames);
            pourcentLoose = deck.loose * (100/deck.nbGames);
            pourcentDraw = deck.draw * (100/deck.nbGames);
            deck['pourcentWin'] = pourcentWin.toFixed(0);
            deck['pourcentLoose'] = pourcentLoose.toFixed(0);
            deck['pourcentDraw'] = pourcentDraw.toFixed(0);
          }
        });
        loader.dismiss();
      })
    } catch(e) {
      loader.dismiss();
    }
  }

  filteringItem(ev){
    // set searchText to the value of the searchbar
    var searchText = ev;

    // Avoid research if searchtext is empty
    if (!searchText || searchText.trim() === '' || searchText === 'Tous') {
      this.decksObservable = this.deckList.valueChanges().map(items => items.sort(this.tools.predicateBy('win')).reverse());
      this.decksObservable.subscribe((res) => {
        this.decks = res as any[];
        this.decks.forEach(deck => {
          let pourcentWin = 0;
          let pourcentLoose = 0;
          let pourcentDraw = 0;
    
          if(deck.nbGames > 0){
            pourcentWin = deck.win * (100/deck.nbGames);
            pourcentLoose = deck.loose * (100/deck.nbGames);
            pourcentDraw = deck.draw * (100/deck.nbGames);
            deck['pourcentWin'] = pourcentWin.toFixed(0);
            deck['pourcentLoose'] = pourcentLoose.toFixed(0);
            deck['pourcentDraw'] = pourcentDraw.toFixed(0);
          }
        });
      })
      return;
    }
    
    this.decksObservable = this.deckList.valueChanges().map(items => items.filter((deck) => {
      
      if (deck.deckName.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        return true;
      }
      return false;
    }));

    this.decksObservable.subscribe((res) => {
      this.decks = res as any[];
      this.decks.forEach(deck => {
        let pourcentWin = 0;
        let pourcentLoose = 0;
        let pourcentDraw = 0;
  
        if(deck.nbGames > 0){
          pourcentWin = deck.win * (100/deck.nbGames);
          pourcentLoose = deck.loose * (100/deck.nbGames);
          pourcentDraw = deck.draw * (100/deck.nbGames);
          deck['pourcentWin'] = pourcentWin.toFixed(0);
          deck['pourcentLoose'] = pourcentLoose.toFixed(0);
          deck['pourcentDraw'] = pourcentDraw.toFixed(0);
        }
      });
    })
  }

}
