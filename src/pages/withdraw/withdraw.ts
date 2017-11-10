import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PayService } from '../../providers/pay-service';
import { ToolService } from '../../providers/tool-service';
// import { UserService } from '../../providers/user-service';

/**
 * Generated class for the WithdrawPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {

  user: any = null;
  type: number = null;
  title: string = null;
  namePlaceholder: string = null;

  moneyOptions: any = [];
  money: number = 10;

  account: any = { no: '', name: '' };

  withdrawData: any = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private pay: PayService,
              private tool: ToolService,
              // private users: UserService
            ) {
    this.user = this.navParams.data.user;
    this.type = this.navParams.data.type;

    this.title = this.type === 0 ? '支付宝提现' : '微信提现';
    this.namePlaceholder = this.type === 0 ? '支付宝实名认证的姓名' : '微信绑定的银行卡真实姓名';
  }

  ionViewDidLoad(): void {
    this.tool.showLoading('拼命加载中...');
    this.pay.getWithdrawList()
      .then(data => {
        this.tool.hideLoading();
        this.money = parseInt(data.items[0]);
        
        let arr = [];
        data.items.forEach(item => {
          arr.push({
            label: `${item}元`,
            value: item,
          })
        });

        this.moneyOptions = arr;

        this.withdrawData = data;
      })
      .catch(error => {
        this.tool.hideLoading();

        setTimeout(() => {
          this.tool.showToast(error.message || error);
        }, 200);

      });
  }

  commit(): void {
    let money   = parseInt(this.money.toString());
    let accNo   = this.type === 0 ? this.account.no : this.account.name;
    let accName = this.account.name;
    let note    = this.type === 0 ? '支付宝提现' : '微信提现';

    if (!accNo) {
      this.tool.showToast('提现账号不能为空');
      return;
    }

    if (!accName) {
      this.tool.showToast('提现姓名不能为空');
      return;
    }

    this.tool.showLoading('提交中...');

    this.pay.withdraw(money, accNo, accName, note)
      .then(data => {
        this.tool.hideLoading();
        
        this.user.balance = data.balance;

        setTimeout(() => {
          this.tool.showToast('提现申请成功');

          this.navCtrl.pop();
        }, 200);
      })
      .catch(error => {
        this.tool.hideLoading();

        setTimeout(() => {
          this.tool.showToast(error.message || error);
        }, 200);
      });
  }

}
