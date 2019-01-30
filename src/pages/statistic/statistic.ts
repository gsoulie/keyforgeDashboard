import { ToolsProvider } from './../../providers/tools/tools';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { cst } from '../../models/constantes';
import { Chart } from 'chart.js';

@IonicPage()
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


  @ViewChild('lineCanvas') lineCanvas;
  barChart: any;
  constructor(public loadingCtrl: LoadingController, 
    public afDB: AngularFireDatabase,
    private tools: ToolsProvider) {
    this.getStats();
    
  }

  ngOnInit(){
    
  }
  onGenerateChart(){
   
    let dataList = [];
    let labelList = [];
    let backgroundColor = [];
    let borderColor = [];
    let i = 0;
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
                  barThickness: 'flex',
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
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
/*
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
 */

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
      this.onGenerateChart();
    }
  }

}
