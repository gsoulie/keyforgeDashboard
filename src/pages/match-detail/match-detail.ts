import { Match } from './../../models/match';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-match-detail',
  templateUrl: 'match-detail.html',
})
export class MatchDetailPage {

  match: Match = null;
  title: string = "Détail du match";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.match = this.navParams.get("match");
   // this.title = this.match.deck1Name + " VS " + this.match.deck2Name;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchDetailPage');
  }

}
