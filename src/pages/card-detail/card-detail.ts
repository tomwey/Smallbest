import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolService } from '../../providers/tool-service';

import { Md5 } from 'ts-md5/dist/md5';

/**
 * Generated class for the CardDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-card-detail',
  templateUrl: 'card-detail.html',
})
export class CardDetailPage {

  card: any;
  secUrl: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    private toolService: ToolService,
  ) {
    this.card = this.navParams.data;

    this.requestQrcode();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad CardDetailPage');
    this.toolService.showLoading('加载中...');
  }

  refresh(): void {
    this.toolService.showLoading('加载中...');

    this.requestQrcode();
  }

  requestQrcode(): void {
    let i  = new Date().getTime();
    let ak = this.generateAccessKey(i);
    
    let url = this.card.body_url + `?code=${this.card.id}&i=${i}&ak=${ak}`;
    this.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  generateAccessKey(i): string {
    return Md5.hashStr(this.card.id.toString() + i.toString() + '3666a3c050d539be71da0f3b283eb433', false).toString();
  }

  loaded(): void {
    this.toolService.hideLoading();
  }

}
