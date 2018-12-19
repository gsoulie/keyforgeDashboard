import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchNewPage } from './match-new';

@NgModule({
  declarations: [
    MatchNewPage,
  ],
  imports: [
    IonicPageModule.forChild(MatchNewPage),
  ],
})
export class MatchNewPageModule {}
