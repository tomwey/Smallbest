import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { ToolService } from '../../providers/tool-service';

/**
 * Generated class for the TradeList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-trade-list',
  templateUrl: 'trade-list.html',
})
export class TradeList {
  trades: any = [];
  hasMore: boolean = false;
  pageNo: number = 1;
  totalPage: number = 1;
  pageSize: number = 30;

  needsShowEmptyResult: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private users: UserService,
              private tool: ToolService) {
  
    // this.loadTrades();
  }

  loadTrades(): Promise<any> {
    return new Promise((resolve) => {
      if (this.pageNo === 1) {
        this.tool.showLoading('加载中...');
      }
      
      this.users.loadTrades(this.pageNo, this.pageSize).then(data => {
        this.tool.hideLoading();

        if (this.pageNo === 1) {
          this.trades = data.data || data;

          this.needsShowEmptyResult = this.trades.length === 0;
          
        } else {
          let temp = this.trades || [];
          this.trades = temp.concat(data.data);
        }

        this.totalPage = Math.floor((data.total + this.pageSize - 1) / this.pageSize);

        this.hasMore = this.totalPage > this.pageNo;

        resolve();
      }).catch(error => {
        this.tool.hideLoading();
        this.tool.showToast(error);

        resolve();
      });
    });
    
  }

  doInfinite(e): void {
    if (this.pageNo < this.totalPage) {
      this.pageNo ++;

      this.loadTrades().then(() => {
        e.complete();
      });
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad TradeList');
  }

  ionViewDidEnter() {
    this.loadTrades();
  }

}
