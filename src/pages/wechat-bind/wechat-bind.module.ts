import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WechatBindPage } from './wechat-bind';

@NgModule({
  declarations: [
    WechatBindPage,
  ],
  imports: [
    IonicPageModule.forChild(WechatBindPage),
  ],
  exports: [
    WechatBindPage
  ]
})
export class WechatBindPageModule {}
