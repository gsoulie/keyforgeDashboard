import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayersListPage } from './players-list';

@NgModule({
  declarations: [
    PlayersListPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayersListPage),
  ],
})
export class PlayersListPageModule {}
