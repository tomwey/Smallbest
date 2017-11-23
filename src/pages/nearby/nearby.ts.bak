import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { ToolService } from '../../providers/tool-service';
// import { QQMaps } from '../../providers/qq-maps';
import { LocationService } from "../../providers/location-service";
import { PartinsService } from '../../providers/partins-service';
// import { BannersService } from '../../providers/banners-service';
// import { UserService } from '../../providers/user-service';
import { PartinDetailPage } from '../partin-detail/partin-detail'; 
// import { EventDetailPage } from "../event-detail/event-detail";

// @IonicPage()
@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html'
})
export class NearbyPage {
  
  // @ViewChild(Content) content: Content;

  hbData:  any = [];
  token: string = null;
  position: any = null;
  
  errorOrEmptyMessage: string = '暂无数据';

  needShowEmptyResult: boolean = false;
  currentPositionDesc: string = '定位中';

  constructor(public navCtrl: NavController, 
              private partins: PartinsService,
              // private banners: BannersService,
              // private qqMaps: QQMaps,
              private locService: LocationService,
              // private platform: Platform,
              private toolService: ToolService,
              // private users: UserService,
              private app: App,
              ) 
  {

  }

  ionViewDidLoad() {

    // if (this.platform.is('mobileweb') && this.platform.is('ios')) {
    //   this.content.enableJsScroll();
    // }
    // this.reload();
    this.doRefresh(null);
  }

  ionViewDidEnter() {  
    // console.log(this.slides);
    this.app.setTitle(this.currentPositionDesc);
  }

  refresh() {
    this.doRefresh(null);
  }

  doRefresh(refresher) {
    // this.pageNo = 1;

    if (!refresher) {
      this.toolService.showLoading('拼命加载中...');
    }
    
    this.locService.getUserPosition(true, true)
      .then(pos => {
        // 获取广告红包
        this.loadEvents(pos)
          .then(data => {
            if (refresher) {
              refresher.complete();
            }
          });
        
        // 解析用户位置
        this.parseUserLocation(pos); 
      })
      .catch(error => {
        this.toolService.hideLoading();
        this.errorOrEmptyMessage = '无法获取位置，请开启定位重试！';
        this.currentPositionDesc = '定位失败!';
        this.needShowEmptyResult = true;
      });
  }

  parseUserLocation(pos): void {
    this.currentPositionDesc = '位置解析中';

    this.locService.parseUserLocation(pos.lat, pos.lng)
      .then(data => {
        this.currentPositionDesc = data.address_2 || data.address_1;
      })
      .catch(error => {
        this.currentPositionDesc = '位置解析失败';
      });
  }

  calcuDistance(distance): string {
    if (distance < 1000) {
      return `${Math.floor(distance)}米`;
    }

    let dist = (distance / 1000.0).toFixed(2);
    return `${dist}千米`;
  }

  private loadEvents(pos: any = { lat: 0, lng: 0 }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.partins.nearby(pos.lat, pos.lng)
        .then(data => {
          this.hbData = data;

          // if (this.pageNo === 1) {
          //   this.eventsData = data.data || data;

            this.needShowEmptyResult = this.hbData.length === 0;

            this.errorOrEmptyMessage = '暂无数据';
          // } else {
          //   let temp = this.eventsData || [];
          //   this.eventsData = temp.concat(data.data || data);
          // }
          // console.log(data.data);
          // this.totalPage = Math.floor(( data.total + this.pageSize - 1 ) / this.pageSize);
          // this.hasMore = this.totalPage > this.pageNo;

          this.toolService.hideLoading();

          resolve(true);
        })
        .catch(error => {

          this.toolService.hideLoading();

          // reject(error);
          resolve(false);

          setTimeout(() => {
            this.toolService.showToast('数据加载失败');
          }, 100);
        });
    });
  }

  gotoDetail(event) {
    this.app.getRootNavs()[0].push(PartinDetailPage, event);
  }

}
