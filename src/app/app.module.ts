import { SuggestionPage } from './../pages/suggestion/suggestion';
import { MatchNewPage } from './../pages/match-new/match-new';
import { LoginPage } from './../pages/login/login';
import { StatisticPage } from './../pages/statistic/statistic';
import { DeckListPage } from './../pages/deck-list/deck-list';
import { MatchDetailPage } from './../pages/match-detail/match-detail';
import { PlayersListPage } from './../pages/players-list/players-list';
import { PlayerDetailPage } from './../pages/player-detail/player-detail';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataProvider } from '../providers/data/data';
import { ToolsProvider } from '../providers/tools/tools';
import { DeckDetailPage } from '../pages/deck-detail/deck-detail';
import { DeckNewPage } from '../pages/deck-new/deck-new';
import { AuthserviceProvider } from '../providers/authservice/authservice';

export const firebaseConfig = {

}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    PlayerDetailPage,
    PlayersListPage,
    DeckDetailPage,
    DeckNewPage,
    MatchDetailPage,
    MatchNewPage,
    DeckListPage,
    StatisticPage,
    LoginPage,
    SuggestionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),	// add declaration here
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    PlayerDetailPage,
    PlayersListPage,
    DeckDetailPage,
    DeckNewPage,
    MatchDetailPage,
    MatchNewPage,
    DeckListPage,
    StatisticPage,
    LoginPage,
    SuggestionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    ToolsProvider,
    AuthserviceProvider,
    AngularFireAuth
  ]
})
export class AppModule {}
