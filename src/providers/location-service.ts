import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from "./api-service";
import { NativeService } from './native-service';

declare var wx;
declare var qq;

@Injectable()
export class LocationService {

  constructor(private storage: Storage,
              private api: ApiService, 
              private nativeService: NativeService
            ) {
      // console.log(`events:${events}`);
    // this.initSDK();
  }

  /**
   * 获取用户位置
   * @param reload 是否强制重新获取位置
   * @returns {Promise}
   */
  getUserPosition(reload: boolean = false, checkAuth: boolean = false): Promise<any> {
    if (this.nativeService.isMobile) {
      return this.nativeService.getUserLocation(checkAuth);
    } else {
      let ua = window.navigator.userAgent.toLowerCase();
      console.log(ua);
      if (ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i)[0] === 'micromessenger') { 
        // 微信浏览器
        return this._getWXPosition(reload);
      } else { 
        // 非微信浏览器
        return this._getH5Location(reload);
      }
    }
    
  }

  /**
   * 通过微信获取位置
   */
  private _getWXPosition(reload: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      if (reload) {
        wx.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: (res) => {
            console.log('-------------------');
            console.log('位置信息: ' + JSON.stringify(res));
            console.log('-------------------');
            let pos = { lat: res.latitude, lng: res.longitude };
            this._savePosition(pos);
            resolve(pos);
          },
          fail: (error) => {
            reject(error);
          }
        });
      } else {
        this.storage.get(this._getUserPositionKey())
          .then(data => {
            if (!data) {
              resolve({ lat: 0, lng: 0 });
            } else {
              resolve(JSON.parse(data));
            }
          })
          .catch(error => {
            // console.log(error);
            reject(error);
          });
      }
    });
  }

  /**
   * 通过腾讯前端定位组件获取位置
   */
  private _getH5Location(reload: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      if (reload) {
        let geolocation = new qq.maps.Geolocation('EJZBZ-VCM34-QJ4UU-XUWNV-3G2HJ-DWBNJ', 'yujian');
        geolocation.getLocation((pos) => {
          this._savePosition(pos);
          resolve({ lat: pos.lat, lng: pos.lng });
        }, (error) => {
          reject(error);
        }, {timeout: 8000});
      } else {
        this.storage.get(this._getUserPositionKey())
        .then(data => {
          if (!data) {
            resolve({ lat: 0, lng: 0 });
          } else {
            resolve(JSON.parse(data));
          }
        })
        .catch(error => {
          // console.log(error);
          reject(error);
        });
      }
    });
  }

  /**
   * 将用户的位置坐标解析成地址
   * @param reload 是否强制重新获取位置
   * @returns {Promise}
   */
  parseUserLocation(lat, lng): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.get('qq/geocode', { lat: lat, lng: lng })
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  private _getUserPositionKey(): string {
    return 'user.position';
  }

  private _savePosition(pos): void {
    this.storage.set(this._getUserPositionKey(), JSON.stringify(pos))
      .then(data => {
        console.log('保存位置成功! ->: ' + data);
      })
      .catch(error => {
        console.log('保存位置失败: ' + error);
      });
  }

}
