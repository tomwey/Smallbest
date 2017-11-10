import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, App, Events } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
import { UserService } from '../../providers/user-service';

/**
 * Generated class for the WechatBindPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wechat-bind',
  templateUrl: 'wechat-bind.html',
})
export class WechatBindPage {

  page: any = { 
    slug: 'wx_bind_desc',
    body: '',
   };
  user: any = { 
    code: '',
  }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private api: ApiService,
              private tool: ToolService,
              private users: UserService,
              private app: App,
              private events: Events,
            ) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad WechatBindPage');
    this.loadBindDesc();
  }

  loadBindDesc() {
    this.tool.showLoading('加载中...');
    this.api.get('pages/' + this.page.slug, {}).then(data => {
      // console.log(data);
      this.page.body = data.body;
      this.tool.hideLoading();
    }).catch(error => {
      // console.log(error);
      this.tool.hideLoading();
      setTimeout(() => {
        this.tool.showToast(error);
      }, 100);
    });
  }

  bind() {
    this.tool.showLoading('绑定中...');
    this.users.bindWX(this.user.code).then(data => {
      this.tool.hideLoading();
      this.tool.showToast('绑定成功');
      
      this.events.publish('user:bind');

      this.app.getRootNavs()[0].pop();
    }).catch(error => {
      this.tool.hideLoading();
      setTimeout(() => {
        this.tool.showToast(error);
      }, 100);
    });
  }

}
