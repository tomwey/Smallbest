import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, App } from 'ionic-angular';
import { UserService } from "../../providers/user-service";

/**
 * Generated class for the PartinResultPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-partin-result',
  templateUrl: 'partin-result.html',
})
export class PartinResultPage {
  // owner: any = null;
  result: any = null;
  partin: any = null;
  code: number = 0;
  message: string = '';
  
  resultDesc: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private users: UserService, private app: App) {
    this.result = this.navParams.data.result;
    this.partin = this.navParams.data.partin;
    this.code = this.navParams.data.code;
    this.message = this.navParams.data.message;

    if (this.code === 0) {
      this.resultDesc = this.result.type === 'hb' ? '恭喜您获得了一个红包' : '恭喜您获得了一张优卡';
    } else {
      this.resultDesc = this.message;
    }
      
  }

  ionViewDidLoad() {
    
  }

  goBack(): void {
    // this.events.publish('hb:opened');
    this.app.getRootNavs()[0].popToRoot();
  }

  doShare(): void {
    this.users.token().then(token => {
      window.location.href = `http://b.hb.small-best.com/wx/share/partin?id=${this.partin.id}&f=${token}`;
    });
  }

  shareDesc(): void {
    this.navCtrl.push('CommWeb', { slug: 'share_reward_tip', title: '分享奖励说明' });
  }

}
