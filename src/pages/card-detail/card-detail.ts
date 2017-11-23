import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToolService } from '../../providers/tool-service';

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
  ) {
    this.card = this.navParams.data;
  }

  take() {
    
  }

}
