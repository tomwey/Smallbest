import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardDetailPage } from './card-detail';

@NgModule({
  declarations: [
    CardDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CardDetailPage),
  ],
  exports: [
    CardDetailPage
  ]
})
export class CardDetailPageModule {}
