import { Component } from '@angular/core';
import { Platform,Events, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from "../pages/tabs/tabs";
// import { AccountBindPage } from '../pages/account-bind/account-bind';
import { UserService } from '../providers/user-service';
import { JPushService } from '../providers/jpush-service';
import { ToolService } from '../providers/tool-service';
import { CardsService } from '../providers/cards-service';
import { PartinsService } from '../providers/partins-service';
import { PartinDetailPage } from '../pages/partin-detail/partin-detail';
// import { ToolService } from '../providers/tool-service';
// import { LocationService } from "../providers/location-service";
// import { LoginPage } from '../pages/login/login';

// import { NativeService } from '../providers/native-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(private platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              private users: UserService,
              private tool: ToolService,
              private cards: CardsService,
              private partins: PartinsService,
              // private modalCtrl: ModalController,
              // private locService: LocationService,
              private events: Events,
              // private nativeService: NativeService
              private jpush: JPushService,
              private app: App,
              ) {
    platform.ready().then(() => {
      statusBar.styleLightContent();
      
      this.initJPush();

      // 隐藏splash
      setTimeout(() => {
        splashScreen.hide();
      },100);

      if (platform.is('cordova')) {
        platform.pause.subscribe(() => {
          this.onPause();
        });
        platform.resume.subscribe(() => {
          this.jpush.setApplicationBadge(0);
          this.onResume();
        });
      }

      this.sendUserSession2('begin');

      this.checkVersion();
    });
  }

  private onPause() {
    this.sendUserSession2('end');
  }

  private initJPush() {
    // 注册极光推送服务
    this.jpush.init().catch();
    
    // 处理收到通知
    this.events.subscribe('handle.notification', (data) => {
      this._openPage(data);
    });

    // 清空通知
    this.jpush.setApplicationBadge(0);
    
    this.jpush.handleNotification();
  }

  private _openPage(extrasData) {
    // alert(JSON.stringify(extrasData));
    // 打开网页
    if (extrasData.mt === '1') {
      window.open(extrasData.link, "_blank", "location=no,allowInlineMediaPlayback=yes,toolbarposition=top,closebuttoncaption=关闭");
      return;
    }

    // 打开红包广告
    if (extrasData.mt === '2') {
      // this.gotoDetail(extrasData.link);
      this.tool.showLoading('正在处理...');
      this.partins.getEvent(extrasData.link, true).then(data => {
        this.tool.hideLoading();

        this.app.getRootNavs()[0].push(PartinDetailPage, data);
      }).catch(error => {
        this.tool.hideLoading();
        this.tool.showToast('获取数据失败');
      });
      return;
    }

    // 打开优惠券
    if (extrasData.mt === '3') {
      this.tool.showLoading('正在处理...');
      this.cards.getCard(extrasData.link, null).then(data => {
        this.tool.hideLoading();

        this.app.getRootNavs()[0].push('CardDetailPage', data);
      }).catch(error => {
        this.tool.hideLoading();
        this.tool.showToast('获取数据失败');
      });
      
      return;
    }
  }

  private onResume() {
    this.sendUserSession2('begin');

    this.checkVersion();
  }

  private checkVersion() {
    if (this.platform.is('cordova')) {
      setTimeout(() => {
        this.users.checkVersion();
      }, 100);
    }
  }

  private sendUserSession2(action: string) {
    this.users.sendSession(action);
  }
}
