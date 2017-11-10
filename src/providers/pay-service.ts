import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { UserService } from './user-service';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PayService {
  // authToken: string = '';
  constructor(private api: ApiService,
              private users: UserService) {}

  withdraw(money: number, accountNo: string, accountName: string, note: string = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.users.token()
        .then(token => {
          this.api.post('pay/withdraw', { token: token, money: money, account_no: accountNo, account_name: accountName, note: note })
            .then(data => {
              resolve(data);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error=>{
          reject(error);
        });
    });
  }

  getWithdrawList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.users.token().then(token => {
        this.api.get('pay/withdraw_list', { token: token })
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    });
  }

  payIn(money: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.users.token().then(token => {
        this.api.post('pay/charge', { token: token, money: money })
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    });
  }

  chargeList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.users.token().then(token => {
        this.api.get('pay/charge_list', { token: token })
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    });
  }

}
