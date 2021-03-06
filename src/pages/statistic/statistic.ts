import { ToolsProvider } from './../../providers/tools/tools';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Component, ViewChild, OnInit } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { cst } from '../../models/constantes';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-statistic',
  templateUrl: 'statistic.html',
})
export class StatisticPage implements OnInit{
  deckList: AngularFireList<any>;
  decksObservable: Observable<any[]>;
  decksTemp: any[] = [];
  decks: any[] = [];
  comboDeck: any[] = [];
  stats: any[];
  selectedPlayer: string = "";
  filteringInProcess = false;

  factionWinRating = [];
  factionDisObject: any = {selected: false, faction: cst.FACTION_DIS, nb: 0};
  factionBrobnarObject: any = {selected: false, faction: cst.FACTION_BROBNAR, nb: 0};
  factionLogosObject: any = {selected: false, faction: cst.FACTION_LOGOS, nb: 0};
  factionMarsObject: any = {selected: false, faction: cst.FACTION_MARS, nb: 0};
  factionSanctumObject: any = {selected: false, faction: cst.FACTION_SANCTUM, nb: 0};
  factionShadowObject: any = {selected: false, faction: cst.FACTION_SHADOW, nb: 0};
  factionUntamedObject: any = {selected: false, faction: cst.FACTION_UNTAMED, nb: 0};


  @ViewChild('lineCanvas') lineCanvas;
  barChart: any;
  constructor(public loadingCtrl: LoadingController,
    public afDB: AngularFireDatabase,
    private tools: ToolsProvider) {
    this.getStats();
  }

  ngOnInit(){
  }

  /**
   * Génération du graphique
   */
  onGenerateChart(){

    let dataList = [];  // lignes de données
    let labelList = []; // labels de chaque ligne
    let backgroundColor = [];
    let borderColor = [];
    let i = 0;

    // Parcours des decks et création du dataset pour le graphique
    this.decksTemp.forEach(elt => {
      if(i < 10){
        labelList.push(elt.deckName + " (" + elt.win + "/" + elt.loose + ")");
        dataList.push(elt.pourcentWin);
        backgroundColor.push('rgba(255,55,' + Math.trunc((i*10)/2)+',0.6)');//13
        borderColor.push('rgba(255,55,' + Math.trunc((i*10)/2)+',1)');//13
      }
      i++;
    });
    // fill the chart with gradient
    //https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/createLinearGradient
    var ctx = this.lineCanvas.nativeElement.getContext("2d");
    var grd=ctx.createLinearGradient(0,0,0,200);
    grd.addColorStop(0,"#cc1e1e");
    grd.addColorStop(1,"white");

    this.barChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'horizontalBar',
      data: {
          labels: labelList,//["Deck1", "Deck2", "Deck3", "Deck4", "Deck5", "Deck6", "Deck7"],
          datasets: [
              {
                  label: "Top 10 % Win",
                  fill: true, // remplissage de la zone sous le graphe
                  lineTension: 0.5, // lissage de la courbe
                  backgroundColor:  backgroundColor,//"rgba(0,0,0,0.1)",//grd,
                  borderColor: borderColor,//'rgba(255,99,132,1)',//"rgba(0,0,0,5)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  barThickness: 'flex', // largeur des barres. 'flex' = définition automatique de la largeur la plus appropriée
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',// jointure de courbe (arrondie, plate ou pointue)
                  pointBorderColor: "rgba(0,0,0,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 0,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(0,0,0,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: dataList,
                  spanGaps: false
              }
          ]
      }
   });
  }

  /**
   * Construction de la liste des decks avec leurs stats
   */
  getStats(){
    const loader = this.loadingCtrl.create({
      content: "Chargement des parties..."
    });
    loader.present();
    try{
      this.deckList = this.afDB.list(cst.TBL_DECK, ref => ref.orderByChild('deckName'));  // récupération des decks dans firebase
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

  defineStat() {
    let top10 = [];
    this.factionWinRating = [];
    this.factionBrobnarObject.nb = 0;
    this.factionDisObject.nb = 0;
    this.factionLogosObject.nb = 0;
    this.factionMarsObject.nb = 0;
    this.factionSanctumObject.nb = 0;
    this.factionShadowObject.nb = 0;
    this.factionUntamedObject.nb = 0;

    if(this.decksTemp.length > 10) {
      top10 = this.decksTemp.slice(0,10);
      top10.forEach(deck => {
        switch(deck.faction1.name) {
          case cst.FACTION_BROBNAR.name :
            this.factionBrobnarObject.nb++;
          break;
          case cst.FACTION_DIS.name :
          this.factionDisObject.nb++;
          break;
          case cst.FACTION_LOGOS.name :
          this.factionLogosObject.nb++;
          break;
          case cst.FACTION_MARS.name :
          this.factionMarsObject.nb++;
          break;
          case cst.FACTION_SANCTUM.name :
          this.factionSanctumObject.nb++;
          break;
          case cst.FACTION_SHADOW.name :
          this.factionShadowObject.nb++;
          break;
          case cst.FACTION_UNTAMED.name :
          this.factionUntamedObject.nb++;
          break;
          default: break;
        }
        switch(deck.faction2.name) {
          case cst.FACTION_BROBNAR.name :
            this.factionBrobnarObject.nb++;
          break;
          case cst.FACTION_DIS.name :
          this.factionDisObject.nb++;
          break;
          case cst.FACTION_LOGOS.name :
          this.factionLogosObject.nb++;
          break;
          case cst.FACTION_MARS.name :
          this.factionMarsObject.nb++;
          break;
          case cst.FACTION_SANCTUM.name :
          this.factionSanctumObject.nb++;
          break;
          case cst.FACTION_SHADOW.name :
          this.factionShadowObject.nb++;
          break;
          case cst.FACTION_UNTAMED.name :
          this.factionUntamedObject.nb++;
          break;
          default: break;
        }
        switch(deck.faction3.name) {
          case cst.FACTION_BROBNAR.name :
            this.factionBrobnarObject.nb++;
          break;
          case cst.FACTION_DIS.name :
          this.factionDisObject.nb++;
          break;
          case cst.FACTION_LOGOS.name :
          this.factionLogosObject.nb++;
          break;
          case cst.FACTION_MARS.name :
          this.factionMarsObject.nb++;
          break;
          case cst.FACTION_SANCTUM.name :
          this.factionSanctumObject.nb++;
          break;
          case cst.FACTION_SHADOW.name :
          this.factionShadowObject.nb++;
          break;
          case cst.FACTION_UNTAMED.name :
          this.factionUntamedObject.nb++;
          break;
          default: break;
        }
      });
      const cptBrobnar = ((this.factionBrobnarObject.nb / 10) * 100).toFixed(0);
      const cptDis = ((this.factionDisObject.nb / 10) * 100).toFixed(0);
      const cptLogos = ((this.factionLogosObject.nb / 10) * 100).toFixed(0);
      const cptSanctum = ((this.factionSanctumObject.nb / 10) * 100).toFixed(0);
      const cptShadow = ((this.factionShadowObject.nb / 10) * 100).toFixed(0);
      const cptMars = ((this.factionMarsObject.nb / 10) * 100).toFixed(0);
      const cptUntamed = ((this.factionUntamedObject.nb / 10) * 100).toFixed(0);
      this.factionWinRating.push({res: cptBrobnar, logo: this.factionBrobnarObject.faction});
      this.factionWinRating.push({res: cptDis, logo: this.factionDisObject.faction});
      this.factionWinRating.push({res: cptLogos, logo: this.factionLogosObject.faction});
      this.factionWinRating.push({res: cptMars, logo: this.factionMarsObject.faction});
      this.factionWinRating.push({res: cptSanctum, logo: this.factionSanctumObject.faction});
      this.factionWinRating.push({res: cptShadow, logo: this.factionShadowObject.faction});
      this.factionWinRating.push({res: cptUntamed, logo: this.factionUntamedObject.faction});
      this.factionWinRating.sort(this.tools.predicateBy("res")).reverse();

    }
  }

  /**
   * Deck filtering
   * @param ev
   */
  filteringItem(ev){
    // Texte de recherche
    var searchText = ev;

    // Si texte vide, afficher tous les decks
    if (!searchText || searchText.trim() === '' || searchText === 'Tous') {
      console.log("filtering : tous");
      this.filteringInProcess = false;
      // All decks
      this.decksObservable = this.deckList.valueChanges().map(items => items.sort(this.tools.predicateBy('win')).reverse());
      this.decksObservable.subscribe((res) => {
        this.decks = res as any[];
        this.calculeStat(this.decks);
      })
      return;
    }

    this.filteringInProcess = true;
    // Filtre sur un deck spécifique
    this.decksObservable = this.deckList.valueChanges().map(items => items.filter((deck) => {
      if (deck.deckName.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        return true;
      }
      return false;
    }));

    // Boucle de calcul des stats
    this.decksObservable.subscribe((res) => {
      this.decks = res as any[];
      this.calculeStat(this.decks);
    })
  }

  /**
   * Calcul des stats pour un deck
   * @param deckDataset
   */
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

      // afficher le graphique uniquement si on est sur le filtre "Tous"
      if(!this.filteringInProcess) {
        this.onGenerateChart();
      }

      this.defineStat();
    }
  }

}
