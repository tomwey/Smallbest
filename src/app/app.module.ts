import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

// Pages
import { HomePage }         from "../pages/home/home";
import { NearbyPage }       from "../pages/nearby/nearby";
import { SettingPage }      from "../pages/setting/setting";
import { PartinDetailPage } from '../pages/partin-detail/partin-detail';
import { CardPage }         from "../pages/card/card";
import { TabsPage }         from '../pages/tabs/tabs';

// Services
import { NativeService }    from '../providers/native-service';
import { GlobalData }       from '../providers/global-data';
import { ApiService }       from '../providers/api-service';
import { ToolService }      from '../providers/tool-service';
import { LocationService }  from '../providers/location-service';
import { UserService }      from '../providers/user-service';
import { PayService }       from '../providers/pay-service';
import { PartinsService }   from '../providers/partins-service';
import { CardsService }     from '../providers/cards-service';
import { BannersService}    from '../providers/banners-service';
import { BadgesService}     from '../providers/badges-service';

// ionic native
import { StatusBar }    from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Network }      from '@ionic-native/network';
import { Device }       from '@ionic-native/device';
import { AppVersion }   from '@ionic-native/app-version';
import { Diagnostic }   from '@ionic-native/diagnostic';
import {File}           from "@ionic-native/file";
import {FileTransfer }  from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';


@NgModule({
  declarations: [
    MyApp,
    NearbyPage,
    SettingPage,
    PartinDetailPage,
    CardPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      // preloadModules: true,
      mode: 'ios',
      backButtonText: '',
      // tabsHideOnSubPages: true,
      // pageTransition: 'ios'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NearbyPage,
    SettingPage,
    PartinDetailPage,
    CardPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Network,
    NativeService,
    Device,
    AppVersion,
    Diagnostic,
    File,
    FileTransfer,
    FileOpener,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocationService,
    ApiService,
    ToolService,
    UserService,
    PayService,
    PartinsService,
    BannersService,
    CardsService,
    BadgesService,
    GlobalData,
  ]
})
export class AppModule {}
