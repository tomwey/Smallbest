import { Component } from '@angular/core';
import { HomePage } from '../home/home';
// import { NearbyPage } from "../nearby/nearby";
import { SettingPage } from '../setting/setting';
// import { CardPage } from '../card/card';
import { Events } from 'ionic-angular';
import { BadgesService } from '../../providers/badges-service';
import { ExplorePage } from '../explore/explore';

// @IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  // tab2Root = NearbyPage;
  tab2Root = ExplorePage;
  // tab3Root = CardPage;
  tab4Root = SettingPage;

  cardBadges: string = "";

  constructor(
    private events: Events,
    private badges: BadgesService,
  ) {

    this.events.subscribe(this.badges.CARD_BADGES_UPDATED_TOPIC, (count: number) => {
      if ( count === 0 ) {
        this.cardBadges = "";
      } else {
        if ( count > 99 ) {
          this.cardBadges = "99+";
        } else {
          this.cardBadges = count.toString();
        }
      }
    });

    // 初始加载总的领取的卡数
    this.badges.loadCardBadges();
  }
}
