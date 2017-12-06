import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { LocationService } from '../../providers/location-service';
import { ToolService } from '../../providers/tool-service';
import { CardsService } from '../../providers/cards-service';
// import { CardDetailPage } from '../card-detail/card-detail';

/**
 * Generated class for the ExplorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {

  cardsData:  any = [];
  hasMore: boolean = false;
  
  pageNo: number = 1;
  pageSize: number = 20;
  totalPage: number = 1;

  errorOrEmptyMessage: string = '暂无数据';
  needShowEmptyResult: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private locService: LocationService,
              // private platform: Platform,
              private toolService: ToolService,
              private cards: CardsService,
              // private users: UserService,
              private app: App,
            ) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ExplorePage');
    this.doRefresh(null);
  }

  refresh() {
    this.doRefresh(null);
  }

  doRefresh(refresher) {
    if (!refresher) {
      this.toolService.showLoading('拼命加载中...');
    }
    
    this.pageNo = 1;

    this.loadData();
  }

  loadData(): Promise<any> {
    return new Promise(resolve => {
      this.locService.getUserPosition(true, true)
      .then(pos => {
        // 获取优惠券数据
        this._startLoad(pos,null).then((val) => resolve(val));
      })
      .catch(error => {
        this._startLoad(null,null).then((val) => resolve(val));
      });
    });
  }

  gotoCardDetail(card) {
    this.app.getRootNavs()[0].push('CardDetailPage', card);
  }

  doInfinite(e): void {
    if (this.pageNo < this.totalPage) {
      this.pageNo ++;

      this.loadData().then(() => {
        e.complete();
      });

    }
  }

  private _startLoad(pos, refresher): Promise<any> {
    return new Promise(resolve => {
      this.cards.getCards(pos, this.pageNo, this.pageSize)
        .then(data => {
          if (this.pageNo === 1) {
            this.cardsData = data.data || data;
            // console.log(data.data);
            this.needShowEmptyResult = this.cardsData.length === 0;
          } else {
            this.needShowEmptyResult = false;

            let temp = this.cardsData || [];
            this.cardsData = temp.concat(data.data || data);
          }
          
          this.totalPage = Math.floor((data.total + this.pageSize - 1) / this.pageSize); 
          this.hasMore = this.totalPage > this.pageNo;

          this.toolService.hideLoading();

          resolve(true);
        })
        .catch(error => {
          // console.log(error);
          this.toolService.hideLoading();
          if (this.pageNo === 1) {
            this.errorOrEmptyMessage = 'Oops, 加载出错了！';
            this.needShowEmptyResult = true;
          } else {
            this.needShowEmptyResult = false;
            setTimeout(() => {
              this.toolService.showToast(error);
            }, 100);
          }

          resolve(false);
        });
    });
  }

}
