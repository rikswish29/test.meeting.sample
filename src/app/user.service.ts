import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import { Observable } from 'rxjs';

import 'rxjs/add/operator/catch';

import 'rxjs/add/operator/do';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public baseUrl = 'http://localhost:4200/api/v1/users';

  constructor(private http: HttpClient) {
    console.log("user service was called");
   }

   public createUser(data): any {
     let myResponse = this.http.post(this.baseUrl + '/signup', data);
     return myResponse;
   }

   public verify(data):any {
     let myResponse = this.http.post(this.baseUrl + '/verify', data);
     return myResponse
   }

   public login(data):any {
     let myResponse = this.http.post(this.baseUrl + '/login', data);
     return myResponse;
   }


  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public sendEmailForPasswordChange(data): any {
    let myResponse = this.http.post(this.baseUrl + '/forgotpassword', data);
    return myResponse;
  }

  public changePassword(userData): any {
    let myResponse = this.http.post(this.baseUrl + '/changePassword', userData);
    return myResponse;
  }

  public getAllUsers(authToken) : any {
    let myResponse = this.http.get(this.baseUrl +'/view/all?authToken='+authToken);
    console.log(myResponse);
    return myResponse;
  }
}
