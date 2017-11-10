import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TradeList } from './trade-list';

@NgModule({
  declarations: [
    TradeList,
  ],
  imports: [
    IonicPageModule.forChild(TradeList),
  ],
  exports: [
    TradeList
  ]
})
export class TradeListModule {}
