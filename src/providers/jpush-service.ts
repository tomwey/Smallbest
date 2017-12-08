import { Injectable } from '@angular/core';
import { JPush } from 'ionic-native';
import { retry } from 'rxjs/operators/retry';

@Injectable()
export class JPushService {

  constructor(
            ) {

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
    return JPush.setAlias(alias);
  }

  /**
   * 设置标签
   * @param tags 标签
   */
  setTags(tags: string): Promise<any> {
    return JPush.setTags(tags);
  }

  private _handleNotification(data) {
    return data;
  }
  
}
