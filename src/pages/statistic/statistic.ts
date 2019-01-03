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
  decksTemp: any[] = [];
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

        // loading decklist in combo
        this.comboDeck = res as any[];
        this.comboDeck.sort(this.tools.predicateBy('deckName'));
        this.comboDeck.push({deckName: "Tous"});

        // calculate stats for each deck
        this.calculeStat(this.decks);
        loader.dismiss();
      })
    } catch(e) {
      loader.dismiss();
    }
  }

  /**
   * Deck filtering
   * @param ev 
   */
  filteringItem(ev){
    // set searchText to the value of the searchbar
    var searchText = ev;

    // Avoid research if searchtext is empty
    if (!searchText || searchText.trim() === '' || searchText === 'Tous') {
      console.log("filtering : tous");
      // All decks
      this.decksObservable = this.deckList.valueChanges().map(items => items.sort(this.tools.predicateBy('win')).reverse());
      this.decksObservable.subscribe((res) => {
        this.decks = res as any[];
        this.calculeStat(this.decks);
      })
      return;
    }
    
    // Filtering on specific deck
    this.decksObservable = this.deckList.valueChanges().map(items => items.filter((deck) => {
      if (deck.deckName.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        return true;
      }
      return false;
    }));

    // loop on observable and calculate stat
    this.decksObservable.subscribe((res) => {
      this.decks = res as any[];
      this.calculeStat(this.decks);
    })
  }

  calculeStat(deckDataset){
    if(deckDataset){
      this.decksTemp = [];
      for(let i = 0; i < deckDataset.length; i++){
        if(deckDataset[i].deckName !== 'Tous'){
          let pourcentWin = 0;
          let pourcentLoose = 0;
          let pourcentDraw = 0;
        
          if(deckDataset[i].nbGames > 0){
            pourcentWin = deckDataset[i].win * (100/deckDataset[i].nbGames);
            pourcentLoose = deckDataset[i].loose * (100/deckDataset[i].nbGames);
            pourcentDraw = deckDataset[i].draw * (100/deckDataset[i].nbGames);
            deckDataset[i]['pourcentWin'] = pourcentWin.toFixed(0);
            deckDataset[i]['pourcentLoose'] = pourcentLoose.toFixed(0);
            deckDataset[i]['pourcentDraw'] = pourcentDraw.toFixed(0);
          }
        
          this.decksTemp.push({
            player: deckDataset[i].player,
            deckName: deckDataset[i].deckName,
            win: deckDataset[i].win,
            loose: deckDataset[i].loose,
            draw: deckDataset[i].draw,
            nbGames: deckDataset[i].nbGames,
            faction1: deckDataset[i].faction1,
            faction2: deckDataset[i].faction2,
            faction3: deckDataset[i].faction3, 
            pourcentWin: pourcentWin.toFixed(0),
            pourcentLoose: pourcentLoose.toFixed(0),
            pourcentDraw: pourcentDraw.toFixed(0)
          })
        }
        
      }
      this.decksTemp.sort(this.tools.predicateBy2('pourcentWin')).reverse();
    }
  }

}
