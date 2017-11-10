import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommWeb } from './comm-web';

@NgModule({
  declarations: [
    CommWeb,
  ],
  imports: [
    IonicPageModule.forChild(CommWeb),
  ],
  exports: [
    CommWeb
  ]
})
export class CommWebModule {}
