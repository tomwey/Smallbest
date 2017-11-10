import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartinResultPage } from './partin-result';

@NgModule({
  declarations: [
    PartinResultPage,
  ],
  imports: [
    IonicPageModule.forChild(PartinResultPage),
  ],
  exports: [
    PartinResultPage
  ]
})
export class PartinResultPageModule {}
