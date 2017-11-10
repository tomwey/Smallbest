import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HBHistory } from './hb-history';

@NgModule({
  declarations: [
    HBHistory,
  ],
  imports: [
    IonicPageModule.forChild(HBHistory),
  ],
  exports: [
    HBHistory
  ]
})
export class HBHistoryModule {}
