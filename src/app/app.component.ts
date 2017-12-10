import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from "../pages/tabs/tabs";
// import { AccountBindPage } from '../pages/account-bind/account-bind';
import { UserService } from '../providers/user-service';
import { JPushService } from '../providers/jpush-service';
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
              // private tool: ToolService,
              // private modalCtrl: ModalController,
              // private locService: LocationService,
              // private events: Events,
              // private nativeService: NativeService
              private jpush: JPushService
              ) {
    platform.ready().then(() => {
      statusBar.styleLightContent();
      
      this.jpush.init();

      // this.jpush.openOrReceiveNotification()
      //   .then(payload => {

      //   });

      // 隐藏splash
      setTimeout(() => {
        splashScreen.hide();
      },100);

      if (platform.is('cordova')) {
        platform.pause.subscribe(() => {
          this.onPause();
        });
        platform.resume.subscribe(() => {
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
