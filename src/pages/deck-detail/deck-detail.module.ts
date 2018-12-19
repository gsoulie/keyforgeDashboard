import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeckDetailPage } from './deck-detail';

@NgModule({
  declarations: [
    DeckDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DeckDetailPage),
  ],
})
export class DeckDetailPageModule {}
