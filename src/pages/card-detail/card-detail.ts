import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToolService } from '../../providers/tool-service';
import { CardsService } from '../../providers/cards-service';

/**
 * Generated class for the CardDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-card-detail',
  templateUrl: 'card-detail.html',
})
export class CardDetailPage {

  card: any = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private toolService: ToolService,
    private cards: CardsService,
  ) {
    this.card = this.navParams.data;
  }

  take() {
    this.toolService.showLoading('领取中...');
    this.cards.takeCard(this.card)
      .then(data => {
        this.toolService.hideLoading();

        this.card.taked = true;

        setTimeout(() => {
          this.toolService.showToast('领取成功');
        }, 100);
      })
      .catch(error => {
        this.toolService.hideLoading();
        setTimeout(() => {
          this.toolService.showToast(error);
        }, 100);
      });
  }

}
