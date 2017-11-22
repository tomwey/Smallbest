import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
// import { Storage }    from '@ionic/storage';
import { UserService } from './user-service';
// import { QQMaps } from './qq-maps';
// import { LocationService } from './location-service';

@Injectable()
export class CardsService {

  constructor(private api: ApiService,
              private user: UserService,
              // private qqMaps: QQMaps
              // private locService: LocationService
            ) {
    
  }

  getCards(pos, pageNo: number = 1): Promise<any> {
    return new Promise((resolve, reject) => {
      let loc = null;
      if (pos) {
        loc = `${pos.lng},${pos.lat}`;
      }
      this.user.token().then(token => {
        this.api.get('cards', { token: token, loc: loc, page: pageNo })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  getUserCards(pageNo: number = 1, pageSize: number = 20): Promise<any> {
    return new Promise((resolve, reject) => {
      this.user.token().then(token => {
        this.api.get('user/cards', { token: token, page: pageNo, size: pageSize })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  getMyCards(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.user.token().then(token => {
        this.api.get('user/card_histories', { token: token })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  getCardUsers(cardId: number, 
               type: number = 0, 
               pageNo: number = 1, 
               pageSize: number = 20): Promise<any> 
  {
    return new Promise((resolve, reject) => {
      this.user.token().then(token => {
        this.api.get(`user/cards/${cardId}/users`, { token: token, 
                                                type: type, 
                                                page: pageNo, 
                                                size: pageSize 
                                              })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

}
