import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { UserService } from '../../providers/user-service'; 
import { ToolService } from '../../providers/tool-service';

/**
 * Generated class for the Wallet page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: 'wallet',
  segment: 'wallet'
})
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  user: any = null;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private users: UserService,
              private app: App,
              private tool: ToolService) {
    this.user = this.navParams.data;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad Wallet');
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.tool.showLoading('加载中...');
    this.users.loadUser().then(data => {
      this.tool.hideLoading();
      this.user.balance = data.balance;
    }).catch(error => {
      this.tool.hideLoading();
    });
  }

  gotoTradeList(): void {
    this.navCtrl.push('TradeList');
  }

  gotoWithdraw(type: number): void {
    if (type === 1) {
      if (this.user.bind_wx === false) {
        this.app.getRootNavs()[0].push('WechatBindPage');
        return;
      }
    }
    this.navCtrl.push('WithdrawPage', { user: this.user, type: type });
  }
}
