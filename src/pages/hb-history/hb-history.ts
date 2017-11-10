import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { ToolService } from '../../providers/tool-service';
// import { EventDetailPage } from "../event-detail/event-detail";
import { PartinDetailPage } from '../partin-detail/partin-detail';

/**
 * Generated class for the HBHistory page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-hb-history',
  templateUrl: 'hb-history.html',
})
export class HBHistory {

  hbList: any = [];
  user: any   = null;
  hasMore: boolean = false;
  pageNo: number = 1;
  pageSize: number = 20;
  totalPage: number = 1;

  needShowEmptyResult: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private userService: UserService,
              private toolService: ToolService) {
    this.user = this.navParams.data;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad HBHistory');
    this.loadHBHistory();
  }

  loadHBHistory(): Promise<any> {
    return new Promise((resolve) => {
      if (this.pageNo === 1) {
        this.toolService.showLoading('加载中...');
      }

      this.userService.getPartinHistory(this.pageNo, this.pageSize)
        .then(data => {
          // console.log(data);
          this.toolService.hideLoading();

          if (this.pageNo === 1) {
            this.hbList = data.data || data;
            // console.log(data.data);
            this.needShowEmptyResult = this.hbList.length === 0;
          } else {
            let temp = this.hbList || [];
            this.hbList = temp.concat(data.data || data);
          }
          
          this.totalPage = Math.floor((data.total + this.pageSize - 1) / this.pageSize); 
          this.hasMore = this.totalPage > this.pageNo;

          resolve();
        })
        .catch(error => {
          console.log(error);
          this.toolService.hideLoading();
          setTimeout(() => {
            this.toolService.showToast(error);
          }, 100);

          resolve();
        });
    });

  }

  gotoHBResult(item): void {
    // this.navCtrl.push('EventDetailPage', item);
    this.navCtrl.push(PartinDetailPage, item);
  }

  doInfinite(e): void {
    if (this.pageNo < this.totalPage) {
      this.pageNo ++;

      this.loadHBHistory().then(() => {
        e.complete();
      });

    }
  }

}
