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
  userCard: any = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
  ) {
    this.userCard = this.navParams.data;
  }

  ionViewDidLoad() {
  }

}
