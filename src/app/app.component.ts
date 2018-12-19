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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public afAuth: AngularFireAuth,
    public auth: AuthserviceProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Games', component: HomePage },
      { title: 'Players', component: PlayersListPage },
      { title: 'Decks', component: DeckListPage },
      { title: 'Stats', component: StatisticPage }
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
}
