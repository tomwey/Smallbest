import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { UserService } from '../../providers/user-service';
import { ToolService } from '../../providers/tool-service';

/**
 * Generated class for the ReportPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  report: any = { content: '', event_id: null, loc: null };
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private viewController: ViewController,
              private user: UserService,
              private api: ApiService,
              private tool: ToolService) {
    this.report.event_id = this.navParams.data.eventId;
  }

  close(): void {
    this.viewController.dismiss();
  }

  send(): void {
    this.tool.showLoading('提交中...');

    this.user.token().then(token => {
      this.report.token = token;
      
      this.api.post('reports', this.report)
      .then(data => {
        this.tool.hideLoading();
        this.close();
      })
      .catch(error => {
        this.tool.hideLoading();
        setTimeout(() => {
          this.tool.showToast(error.message || error);
        }, 200);
      });

    });
    
  }

}
