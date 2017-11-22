import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { UserService } from './user-service';
import { LocationService } from './location-service';

/*
  Generated class for the EventsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PartinsService {

  constructor(private api: ApiService,
              private user: UserService,
              private locService: LocationService
            ) {
    
  }

  // 获取红包列表
  list(loc: string = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.user.token().then(token => {
        this.api.get('partins', { token: token, loc: loc })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  // 获取发现列表
  explore(loc: string = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.user.token().then(token => {
        this.api.get('partins/explore', { token: token, loc: loc })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  // 获取附近列表
  nearby(lat, lng): Promise<any> {
    return new Promise((resolve, reject) => {
      this.user.token().then(token => {
        this.api.get('partins/nearby', { token: token, lat: lat, lng: lng })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  getHBOwnerTimeline(hbId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.user.token().then(token => {
        this.api.get(`partins/${hbId}/owner_timeline`, { token: token })
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    });
  }

  private _loadEvent(eventId: number, token: string, lat, lng, needWriteViewLog:boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.get(`partins/${eventId}/body`, { token: token, loc: `${lng},${lat}`, t: needWriteViewLog ? 1 : 0 })
          .then(data => {
            resolve(data);
          })
          .catch(error => reject(error));
    });
  }
  getEvent(eventId: number, needWriteViewLog: boolean): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.user.token().then(token => {
        // this.qqMaps.startLocating()
        this.locService.getUserPosition()
          .then(pos => {
            this._loadEvent(eventId, token, pos.lat, pos.lng, needWriteViewLog)
              .then(data => resolve(data))
              .catch(error => reject(error));
          })
          .catch(error => {
            this._loadEvent(eventId, token, 0, 0, needWriteViewLog)
              .then(data => resolve(data))
              .catch(error => reject(error));
          });
      }).catch(()=>{});
    } );
  }

  getEventEarns(eventId: number, pageNo: number, pageSize: number): Promise<any> {
    return this.api.get(`partins/${eventId}/earns`, { page: pageNo, size: pageSize });
  }

  private _commit(token, payload): Promise<any> {
    return new Promise((resolve, reject) => {
      let payloadJson = JSON.stringify({ answer: payload.answer, location: payload.location });
        // console.log(payloadJson);
        this.api.post(`partins/${payload.hb.id}/commit`, 
                      { token: token, payload: payloadJson })
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          })
    });
  }
  commit(payload): Promise<any> {
    return new Promise((resolve, reject) => {
      this.user.token().then(token => {
        let hb = payload.hb;
        let reload: boolean = false;
        if (hb && hb.rule_type === 'checkin') {
          reload = true;
        }
        // this.qqMaps.startLocating(reload)
        this.locService.getUserPosition(reload)
          .then(pos => {
            payload.location = `${pos.lng},${pos.lat}`
            this._commit(token, payload)
              .then(data => resolve(data))
              .catch(error => reject(error));
          })
          .catch(error => {
            payload.location = '0,0'
            this._commit(token, payload)
              .then(data => resolve(data))
              .catch(error => reject(error));
          });
      }).catch(error => {
        reject(error);
      });
    });
  }

}
