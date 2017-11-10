import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
// import { Storage }    from '@ionic/storage';
// import { UserService } from './user-service';

/*
  Generated class for the EventsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BannersService {

  constructor(private api: ApiService,
              // private user: UserService,
              // private qqMaps: QQMaps
              ) {
    
  }

  getBanners(token: string = null, loc: string = null): Promise<any> {
    return this.api.get('banners', { token: token, loc: loc });
  }

}
