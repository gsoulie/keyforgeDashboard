import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeckListPage } from './deck-list';

@NgModule({
  declarations: [
    DeckListPage,
  ],
  imports: [
    IonicPageModule.forChild(DeckListPage),
  ],
})
export class DeckListPageModule {}
