import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeckNewPage } from './deck-new';

@NgModule({
  declarations: [
    DeckNewPage,
  ],
  imports: [
    IonicPageModule.forChild(DeckNewPage),
  ],
})
export class DeckNewPageModule {}
