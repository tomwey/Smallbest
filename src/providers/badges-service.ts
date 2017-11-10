import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { ApiService } from './api-service';
import { UserService } from './user-service';
import { Storage } from '@ionic/storage';

@Injectable()
export class BadgesService {
  // authToken: string = '';
  CARD_BADGES_UPDATED_TOPIC: string = "card.badges.updated";

  constructor(private api: ApiService,
              private storage: Storage,
              private users: UserService,
              private events: Events,
            ) {

  }

  saveCurrentBadge(badge: number): void {
    this.storage.set('card.badges', badge);
  }

  hideBadges(): void {
    this._updateCurrentBadge(0);
  }

  getCurrentBadges(): Promise<any> {
    return this.storage.get('card.current.badges');
  }

  incrementCurrentBadge(): void {
    this.storage.get('card.current.badges').then(data => {
      let current = parseInt(data || 0);
      this._updateCurrentBadge(current + 1);
    });
  }

  loadCardBadges(): void {
    this.users.token().then(token => {
      this.api.get('user/card_badges', { token: token })
        .then(data => {
          let count = parseInt(data.count);
          this._getTotalBadge().then(badge => {
            let currentBadge = parseInt(badge || 0);
            if (count > currentBadge) {
              this._updateCurrentBadge(count - currentBadge);
            }
          }).catch();
        })
        .catch((error) => {});
    });
  }

  private _getTotalBadge(): Promise<any> {
    return this.storage.get('card.badges');
  }

  private _updateCurrentBadge(badge: number): void {
    this.storage.set('card.current.badges', badge);
    this.events.publish(this.CARD_BADGES_UPDATED_TOPIC, badge);
  }
  
}
