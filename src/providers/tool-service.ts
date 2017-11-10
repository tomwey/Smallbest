import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Loading } from 'ionic-angular';

/*
  Generated class for the ToolService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ToolService {
  private loading: Loading;
  private loadingIsOpen: boolean = false;

  constructor(private toastCtrl: ToastController,
              private loadingCtrl: LoadingController) {
    // console.log('Hello ToolService Provider');
  }

  /**
   * 显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast(message: string = '操作完成', duration: number = 2000): void {
    this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'middle',
      showCloseButton: false
    }).present();
  }

  /**
   * 显示Loading
   * @param content 显示的内容
   */
  showLoading(content: string = ''): void {
    if ( !this.loadingIsOpen ) {
      this.loadingIsOpen = true;
      this.loading = this.loadingCtrl.create({
        content: content,
        spinner: 'crescent',
      });
      this.loading.present();
      setTimeout( () => {
        this.hideLoading();
      }, 10000 ) // 最长显示10秒
    }
  }

  /**
   * 关闭Loading
   */
  hideLoading(): void {
    this.loadingIsOpen && this.loading.dismiss().catch(error => {
      console.log(error);
    });
    this.loadingIsOpen = false;
  }

}
