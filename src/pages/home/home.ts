import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { MatchDetailPage } from './../match-detail/match-detail';
import { MatchNewPage } from './../match-new/match-new';
import { DataProvider } from '../../providers/data/data';
import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Content } from 'ionic-angular';
import { Observable } from 'rxjs';
import { cst } from '../../models/constantes';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  dataList: AngularFireList<any>;
  deckDataList: AngularFireList<any>;
  matchs: Observable<any[]>;
  deckList: AngularFireList<any>;
  deckObservable: Observable<any[]>;
  decks: any[] = [];
  matchs2: any[] = [];
  selectedDeck;

  // variables pour la gestion du lazy loading
  @ViewChild(Content) content: Content; // ion-content 
  private direction: string = ""; // to get scroll direction
  private lastScrollTop: number = 0;
  private lastItem = null;
  private filteringMode = false;

  constructor(public navCtrl: NavController,
    private dataService: DataProvider,
    public afDB: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
      this.getMatchs();
  }

  ngAfterViewInit() {
    // Listener sur scroll
    this.content.ionScrollEnd.subscribe((data) => {
      let currentScrollTop = data.scrollTop;
      if(currentScrollTop > this.lastScrollTop){
        this.direction = 'down';
      }else if(currentScrollTop < this.lastScrollTop){
        this.direction = 'up';
      }
      this.lastScrollTop = currentScrollTop;
    });
  }

  /**
   * Infinite scroll listener
   * @param infiniteScroll 
   */
  scrollHandler(infiniteScroll){
    setTimeout(() => {
      // Refresh uniquement si scroll vers le bas
      if(this.direction == 'down'){
        // Refresh uniquement lorsque la fin de page est atteinte
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          this.getMatchs();
        }
      }
      infiniteScroll.complete();
    }, 500);    
  }

  /**
   * Liste de tous les matchs
   */
  getMatchs(){
    if(this.filteringMode == false){
      this.deckDataList = this.afDB.list(cst.TBL_DECK, ref => ref.orderByChild('deckName'));  // récupération des matchs dans firebase
      this.deckObservable = this.deckDataList.valueChanges();
      this.deckObservable.subscribe((res) => {
        this.decks = res as any[];
        this.decks.push({deckName: "Tous"});
      })

      var loader = this.loadingCtrl.create({
        content: "Chargement des parties..."
      });
      loader.present();

      // Récupération en tenant compte du lazy loading (chargement 20 par 20)
      if(this.lastItem === null){
        this.dataList = this.afDB.list(cst.TBL_MATCH, ref => ref.orderByChild('id').limitToLast(20));
      } else {
        this.dataList = this.afDB.list(cst.TBL_MATCH, ref => ref.orderByChild('id').endAt(this.lastItem).limitToLast(20));
      }
      this.matchs = this.dataList.valueChanges().map(items => items.sort().reverse());
      try{
        this.matchs.subscribe((res) => {
            let temp = res as any[];
            this.lastItem = temp[temp.length-1].id;

            // Si pas premier chargement, retirer le premier item sinon il sera ajouté en double
            if(this.matchs2.length > 0){
              temp.splice(0,1);
            }
            temp.forEach(match => {
              this.matchs2.push(match);
            });
            loader.dismiss();        
        })
      } catch(e){
        loader.dismiss();
      }
    }
  }

  filteringItem(ev){
    // Texte de recherche
    var searchText = ev;

    // Si texte vide, charger tous les matchs
    if (!searchText || searchText.trim() === '' || searchText === 'Tous') {
      this.filteringMode = false;
      this.lastItem = null;
      this.matchs2 = [];
      this.getMatchs();
      
      return;
    } else {
      this.filteringMode = true;
    }
    
    this.dataList = this.afDB.list(cst.TBL_MATCH, ref => ref.orderByChild('id'));
    this.matchs = this.dataList.valueChanges().map(items => items.filter((match) => {      
      if ((match.deck1.deckName.toLowerCase().indexOf(searchText.toLowerCase()) > -1) || (match.deck2.deckName.toLowerCase().indexOf(searchText.toLowerCase()) > -1)) {
        return true;
      }
      return false;
    }));
    this.matchs.subscribe((res) => {
      this.matchs2 = res as any[];
      this.lastItem = null;
    })
  }

  onAddNewMatch(){
    this.navCtrl.push(MatchNewPage,{callback: () => {
      this.filteringMode = false;
      this.lastItem = null;
      this.matchs2 = [];
      this.getMatchs();}})
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
            this.dataService.deleteMatch(selectedMatch, () => {

              this.filteringMode = false;
              this.lastItem = null;
              this.matchs = null;
              this.matchs2 = [];
              this.getMatchs();
            });
          }
        }
      ]
    });
    confirm.present();
  }
}
