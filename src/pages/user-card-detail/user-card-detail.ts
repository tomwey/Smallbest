import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from "@angular/platform-browser";
import { Md5 } from 'ts-md5/dist/md5';

/**
 * Generated class for the UserCardDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-card-detail',
  templateUrl: 'user-card-detail.html',
})
export class UserCardDetailPage {

  browser: any = {
    isLoaded: false,
    proObj: null,
    progress: 0,
    secUrl: '',
    title: '加载中',
    url: '',
  };

  card: any = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
  ) {
    this.card = this.navParams.data;

    this.browser.title = '详情';
    this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.generateUrl());

    // this.reload();
  }

  generateUrl() {
    let i  = new Date().getTime();
    let ak = this.generateAccessKey(i);
    let url = this.card.body_url + `?code=${this.card.id}&i=${i}&ak=${ak}`;
    return url;
  }

  generateAccessKey(i): string {
    return Md5.hashStr(this.card.id.toString() + i.toString() + '3666a3c050d539be71da0f3b283eb433', false).toString();
  }

  ionViewDidLoad() {
    if (!this.browser.proObj) {
      this.browser.proObj = document.getElementById('progress');
    }

    this.onprogress();
  }

  // 生成随机数
  private random(min: number, max: number): number 
  {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // 网页访问进度
  private onprogress() {
    // 随机时间
    let timeout = this.random(10,30);

    let timer = setTimeout(() => {
      if (this.browser.isLoaded) {
        this.browser.proObj.style.width = '100%';
        clearTimeout(timer);
        return;
      }

      // 随机进度
      this.browser.progress += this.random(1,5);
     
      // 随机进度不能超过 90%, 以免页面还没加载完毕，进度已经 100% 了
      if (this.browser.progress > 90) {
        this.browser.progress = 90;
      }

      this.browser.proObj.style.width = this.browser.progress + '%';
      this.onprogress();

    }, timeout);
  }

  // 如果iframe 页面加载成功后
  loaded() {
    this.browser.isLoaded = true;
  }

  // 重新加载页面
  reload() {
    let title = this.browser.title;
    // let url   = this.browser.secUrl;
    this.browser.title = '加载中';
    this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');

    setTimeout(() => {
      this.browser.isLoaded = false;
      this.browser.progress = 0;
      if (!this.browser.proObj) {
        this.browser.proObj = document.getElementById('progress');
      }
      this.onprogress();
      this.browser.title = title;
      this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.generateUrl());
    }, 10);
  }

}
