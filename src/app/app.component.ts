import { AuthserviceProvider } from './../providers/authservice/authservice';
import { LoginPage } from './../pages/login/login';
import { StatisticPage } from './../pages/statistic/statistic';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../pages/home/home';
import { DeckListPage } from '../pages/deck-list/deck-list';
import { PlayersListPage } from '../pages/players-list/players-list';
import { SuggestionPage } from '../pages/suggestion/suggestion';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public afAuth: AngularFireAuth,
    public auth: AuthserviceProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Games', component: HomePage, icon:"md-people" },
      { title: 'Players', component: PlayersListPage, icon:"md-person" },
      { title: 'Decks', component: DeckListPage, icon:"md-albums" },
      { title: 'Stats', component: StatisticPage, icon:"md-medal" },
      { title: 'Suggestions', component: SuggestionPage, icon:"md-help"}
    ];

    const authObserver = afAuth.authState
    .subscribe(user => {
      if(user){
        this.rootPage = HomePage;
        authObserver.unsubscribe();
      } else {
        this.rootPage = LoginPage;
        authObserver.unsubscribe();
      }
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  /**
   * Disconnect user
   */
  onDisconnect(){
    const confirm = this.alertCtrl.create({
      title: 'Déconnexion',
      message: 'Êtes-vous certain de vouloir vous déconnecter ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.auth.logoutUser()
      .then(() => {
        this.nav.setRoot(LoginPage);
      });
          }
        }
      ]
    });
    confirm.present();

  }
  
  onOpenRulebook(){
    let url = "https://kop-cdn.keyforgegame.com/filer_public/30/03/30032847-fa82-46a3-a28b-984efc5a91ca/keyforge_rulebook_v8-compressed.pdf?fbclid=IwAR07WNrKYQoGT0ARh3lZDmlgrl65UeB-JYKwfHAsMpHpd5YdrEAE77Gbrfs";
    window.open(url,'_system','location=yes');
  }
}
