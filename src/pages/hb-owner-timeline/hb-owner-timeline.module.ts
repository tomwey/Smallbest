import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HBOwnerTimelinePage } from './hb-owner-timeline';

@NgModule({
  declarations: [
    HBOwnerTimelinePage,
  ],
  imports: [
    IonicPageModule.forChild(HBOwnerTimelinePage),
  ],
  exports: [
    HBOwnerTimelinePage
  ]
})
export class HBOwnerTimelinePageModule {}
