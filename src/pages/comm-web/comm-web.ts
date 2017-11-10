import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';

/**
 * Generated class for the CommWeb page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-comm-web',
  templateUrl: 'comm-web.html',
})
export class CommWeb {

  page: any = {
    title: '',
    body:  '',
    slug:  '',
  };
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private api: ApiService,
              private toolService: ToolService) {
    this.page.title = this.navParams.data.title;
    this.page.slug  = this.navParams.data.slug;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad CommWeb');
    // this.loadPageData();
  }

  ionViewDidEnter() {
    this.loadPageData();
  }

  loadPageData(): void {
    this.toolService.showLoading('加载中...');
    this.api.get('pages/' + this.page.slug, {}).then(data => {
      // console.log(data);
      this.page.body = data.body;
      this.toolService.hideLoading();
    }).catch(error => {
      // console.log(error);
      this.toolService.hideLoading();
      setTimeout(() => {
        this.toolService.showToast(error);
      }, 100);
    });
  }

}
