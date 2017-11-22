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
    
    this.locService.getUserPosition(true, true)
      .then(pos => {
        // 获取优惠券数据
        this._startLoad(pos,refresher);
      })
      .catch(error => {
        this._startLoad(null,refresher);
      });
  }

  gotoCardDetail(card) {
    this.app.getRootNavs()[0].push('CardDetailPage', card);
  }

  private _startLoad(pos, refresher) {
    this._loadData(pos)
    .then(data => {
      this.toolService.hideLoading();

      this.cardsData = data;

      if (this.cardsData.length === 0) {
        this.errorOrEmptyMessage = '暂无数据';
        this.needShowEmptyResult = true;
      }

      if (refresher) {
        refresher.complete();
      }
    }).catch(error => {
      this.toolService.hideLoading();

      this.errorOrEmptyMessage = 'Oops, 加载出错了！';
      this.needShowEmptyResult = true;
    });
  }

  private _loadData(pos): Promise<any> {
    return this.cards.getCards(pos);
  }

}
