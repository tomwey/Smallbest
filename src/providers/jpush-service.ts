import { Injectable } from '@angular/core';
import { JPush } from 'ionic-native';
import { JPushPlugin } from '@ionic-native/jpush';
import { AlertController, Events } from 'ionic-angular';
// import { ToolService } from './tool-service';
// import { CardsService } from './cards-service';
// import { PartinsService } from './partins-service';
// import { PartinDetailPage } from '../pages/partin-detail/partin-detail';

@Injectable()
export class JPushService {

  constructor(
    private jpush: JPushPlugin,
    private alertCtrl: AlertController,
    // private app: App,
    // private tool: ToolService,
    // private cards: CardsService,
    // private partins: PartinsService,
    private events: Events,
  ) {

  }

  setApplicationBadge(badge: number) {
    this.jpush.setApplicationIconBadgeNumber(badge);
  }

  handleNotification() {
    // 打开通知
    document.addEventListener("jpush.openNotification", (event?:any) => {
      this._openPage(event);
    }, false);
    
    // 收到通知
    document.addEventListener("jpush.receiveNotification", (event?:any) => {
      this.setApplicationBadge(0);
      this._showAlert(event);
    }, false);
  }

  /**
   * 检测用户通知是否开启
   * @return true or false
   */
  checkNotificationStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      JPush.getUserNotificationSettings()
        .then(data => {
          if (data.authorizationStatus) {
            resolve(data.authorizationStatus > 1);
          } else {
            resolve(data > 0);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * 注册推送服务
   */
  init(): Promise<any> {
    return JPush.init();
  }

  /**
   * 打开通知或在App内收到通知
   */
  openOrReceiveNotification(): Promise<any> {
    return new Promise((resolve, reject) => {
      JPush.openNotification().then(data => {
        let payload = this._handleNotification(data);
        resolve(payload);
      })
      .catch(error => {
        reject(error);
      });

      JPush.receiveNotification()
        .then(data => {
          let payload = this._handleNotification(data);
          resolve(payload);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * 设置别名
   * @param alias 别名 
   */
  setAlias(alias: string): Promise<any> {
    return this.jpush.setAlias({ sequence: 1, alias: alias });
    // return JPush.setAlias(alias);
  }

  /**
   * 设置标签
   * @param tags 标签
   */
  setTags(tags: string): Promise<any> {
    return JPush.setTags(tags);
    // return this.jpush.setTags()
  }

  private _handleNotification(data) {
    return data;
  }

  private _openPage(event) {
    let extrasData = event.extras || event;
    // let alertBody = event.aps || event;
    this.events.publish('handle.notification', extrasData);
  }

  private _showAlert(event) {
    let extrasData = event.extras || event;
    let alertBody = event.aps || event;

    let buttons;
    if (extrasData.type === 0) {
      buttons = ['确定'];
    } else {
      buttons = [
        {
          text: '忽略',
          handler: () => {

          }
        },
        {
          text: '立即查看',
          handler: () => {
            this._openPage(event);
          }
        }
      ]
    };

    this.alertCtrl.create({
      title: extrasData.title || '',
      subTitle: alertBody.alert || '',
      enableBackdropDismiss: false,
      buttons: buttons,
    }).present();
  }
  
}
