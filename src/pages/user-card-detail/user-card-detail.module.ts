import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserCardDetailPage } from './user-card-detail';

@NgModule({
  declarations: [
    UserCardDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(UserCardDetailPage),
  ],
})
export class UserCardDetailPageModule {}
