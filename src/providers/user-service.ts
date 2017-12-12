import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { Storage } from '@ionic/storage';
import { APP_VERSION } from './api-service';
import { Device } from "@ionic-native/device";

import { NativeService } from './native-service';
import { AlertController } from 'ionic-angular';
import { JPushService } from './jpush-service';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {
  // authToken: string = '';
  hasShownVersionAlert: boolean = false;

  constructor(private api: ApiService,
              private storage: Storage,
              private device: Device,
              private nativeService: NativeService,
              private alertCtrl: AlertController,
              private jpush: JPushService
            ) {
    // console.log('Hello UserService Provider');
    
  }

  saveToken(token: string): Promise<any> {
    this.jpush.setAlias(token);
    return this.storage.set('token', token);
  }

  token(): Promise<any> {
    return new Promise((resolve) => {
      this.storage.get('token').then( val => {
        // resolve('aed672e8bbe94206995a78dc6cd6ed1b'); // 后台wmarshx用户的Token aed672e8bbe94206995a78dc6cd6ed1b
        // resolve('aa905ea8fca84485a7a4c2e1f0697cb5'); // 本地测试
        resolve(val)
      } );
    });
  }

  signup(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.nativeService.getUUID().then(uuid => {
        this.api.post('account/app_signup', { uuid: this.device.uuid || '0',
                                              model: this.device.model || 'browser',
                                              os: this.device.platform || 'web',
                                              osv: this.device.version || 'web',
                                              is_vir: this.device.isVirtual === true ? 1 : 0
        }).then(data => {
          this.saveToken(data.token)
            .then(() => resolve(data))
            .catch((error) => reject(error));
          // resolve(data)
        }).catch(error => (error));
      });
    });
  }

  // 手机号登录
  login(mobile, code, invite_code = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.post('account/signin', { mobile: mobile, 
        code: code, 
        invite_code: invite_code 
       })
       .then(data => {
          if (data.token) {
            this.saveToken(data.token)
              .then(() => resolve(data))
              .catch((error) => reject(error));
          } else {
            reject('TOKEN无效');
          }
       })
       .catch(error => reject(error));
    });
  }

  // 获取验证码
  getCode(mobile): Promise<any> {
    return this.api.post('auth_codes', { mobile: mobile });
  }

  bindAccount(code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.post('account/bind', { code: code })
        .then(data => {
          this.jpush.setAlias(data.token);
          this.storage.set('token', data.token).then(data=>{
            resolve(data);
          }).catch(error=>reject(error));
        })
        .catch(error=>reject(error));
    });
  }

  bindWX(code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.token().then(token => {
        this.api.post('account/bind', { code: code, token: token })
        .then(data => {
          this.jpush.setAlias(data.token);
          this.storage.set('token', data.token).then(data=>{
            resolve(data);
          }).catch(error=>reject(error));
        })
        .catch(error=>reject(error));
      });
    });
  }

  applyPay(money): Promise<any> {
    return new Promise((resolve, reject) => {
      this.token().then(token => {
        this.api.post('user/apply_pay', { token: token, money: money })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  // 获取红包历史
  getHBHistory(pageNo: number, pageSize: number = 20): Promise<any> {
    return new Promise((resolve, reject) => {
      this.token().then(token => {
        this.api.get('user/hb_earns', { token: token, page: pageNo, size: pageSize }).then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    });
  }

    // 获取红包历史
    getPartinHistory(pageNo: number, pageSize: number = 20): Promise<any> {
      return new Promise((resolve, reject) => {
        this.token().then(token => {
          this.api.get('user/partin_earns', { token: token, page: pageNo, size: pageSize }).then(data => {
            resolve(data);
          }).catch(error => {
            reject(error);
          });
        });
      });
    }

  // 获取用户个人信息
  loadUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.token().then(token => {
        this.api.get('user/me', { token: token })
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    });
  }

  loadTrades(pageNo: number, pageSize: number = 20): Promise<any> {
    return new Promise((resolve, reject) => {
      this.token().then(token => {
        this.api.get('user/trades', { token: token, page: pageNo, size: pageSize })
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    });
  }

  // 获取关注的商家
  getFollowedMerchants(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.token().then(token => {
        this.api.get('follows', { token: token }).then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    });
  }

  // 提交用户会话
  sendSession(action: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.token().then(token => {
        if (token) {
          
          this.jpush.setAlias(token);

          let checkAuth = this.nativeService.isIos() ? false : true;
          this.nativeService.getUserLocation(checkAuth).then(pos => {
            this._sendSession(action, token, `${pos.lng},${pos.lat}`).then(data => {
              resolve(data);
            }).catch(error => reject(error));
          }).catch(error => {
            this._sendSession(action, token, null).then(data => {
              resolve(data);
            }).catch(error => reject(error));
          });
        } else {
          resolve(false);
        }
      });
    });
  }

  private _sendSession(action, token, loc) {
    return new Promise((resolve, reject) => {
      this.nativeService.getAppVersion().then(version => {
        let device = this.nativeService.getDeviceInfo();
        if (action === 'end') {
          this.storage.get('session_id').then(sid => {
            if (!sid) {
              resolve(false);
            } else {
              this.api.post('user/session/end', 
                { token: token, 
                  sid: sid, 
                  loc: loc, 
                  network: this.nativeService.getNetworkType(), 
                  version: version || APP_VERSION,
                  device: device,
                 })
                .then(data => {
                  // if (data.sid === sid)
                  //   this.storage.remove('session_id');
                  resolve(true);
                })
                .catch(error => reject(error));
            }
          });
        } else {
          this.api.post('user/session/begin', 
            { token: token, loc: loc, network: this.nativeService.getNetworkType(), 
              version: version || APP_VERSION, device: device })
            .then(data => {
              if (data.sid)
                this.storage.set('session_id', data.sid);
              resolve(data);
            })
            .catch(error => reject(error));
        }
      });
      
    });
    
  }

  // 处理用户会话
  handleSession(action: string, loc: string = null, network: string = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.token().then(token => {
        if (token) {
          let device = this.nativeService.getDeviceInfo();
          if (action === 'end') {
            this.storage.get('session_id').then(sid => {
              if (!sid) {
                resolve(false);
              } else {
                this.api.post('user/session/end', 
                  { token: token, 
                    sid: sid, 
                    loc: loc, 
                    network: network, 
                    version: APP_VERSION,
                    device: device,
                   })
                  .then(data => {
                    // if (data.sid === sid)
                    //   this.storage.remove('session_id');
                    resolve(true);
                  })
                  .catch(error => reject(error));
              }
            });
          } else {
            this.api.post('user/session/begin', 
              { token: token, loc: loc, network: network, 
                version: APP_VERSION, device: device })
              .then(data => {
                if (data.sid)
                  this.storage.set('session_id', data.sid);
                resolve(data);
              })
              .catch(error => reject(error));
          }
        } else {
          resolve(false);
        }
      });
    });
  }

  /**
   * 用户版本更新
   */
  checkVersion(): void {
    this.token().then(token => {
      this.nativeService.getAppVersion().then(value => {
        this.api.get('user/check_version', 
        { token: token, 
          m: this.device.model,
          os: this.device.platform,
          osv: this.device.version,
          bv: value,
          })
        .then(resp => {
          this._showVersionUpgradeAlert(resp);
        })
        .catch(error => {}); // end api get
      }); // end getAppVersion
    }); // end token
  } // end checkVersion

  private _showVersionUpgradeAlert(resp) {
    let buttons;
    if (resp.must_upgrade === true) {
      buttons = [{ text: '立即更新',
                    handler: data => {
                      this.hasShownVersionAlert = false;
                      this.nativeService.downloadApp(resp.app_url);
                    } }];
    } else {
      buttons = [
        { 
          text: '不了',
          handler: data => {
            this.hasShownVersionAlert = false;
          } 
        },
        { 
          text: '立即更新',
          handler: data => {
            this.hasShownVersionAlert = false;

            this.nativeService.downloadApp(resp.app_url);
          } 
        },
      ];
    }

    if (!this.hasShownVersionAlert) {
      this.hasShownVersionAlert = true;
      this.alertCtrl.create({
        title: `发现新版本${resp.version}`,
        subTitle: resp.change_log,
        cssClass: 'upgrade-alert',
        buttons: buttons,
        enableBackdropDismiss: false,
      }).present();
    }
  }
}
