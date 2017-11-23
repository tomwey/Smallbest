import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserCardPage } from './user-card';

@NgModule({
  declarations: [
    UserCardPage,
  ],
  imports: [
    IonicPageModule.forChild(UserCardPage),
  ],
})
export class UserCardPageModule {}
