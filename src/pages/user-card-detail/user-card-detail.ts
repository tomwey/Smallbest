import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CardsService } from '../../providers/cards-service';
import { ToolService } from '../../providers/tool-service';

/**
 * Generated class for the UserCardDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-card-detail',
  templateUrl: 'user-card-detail.html',
})
export class UserCardDetailPage {
  userCard: any = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private cards: CardsService,
    private tool: ToolService,
  ) {
    this.userCard = this.navParams.data;
  }

  ionViewDidLoad() {
    this.loadData();
  }

  reload() {
    this.loadData();
  }

  loadData() {
    this.tool.showLoading('加载中...');
    this.cards.getUserCardBody(this.userCard.id)
      .then(data => {
        this.userCard = data;

        this.tool.hideLoading();
      })
      .catch(error => {
        this.tool.hideLoading();

        setTimeout(() => {
          this.tool.showToast(error);
        }, 100);
      });
  }

}
