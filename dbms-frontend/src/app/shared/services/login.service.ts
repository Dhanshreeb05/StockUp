import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  isUserLoggedIn = new BehaviorSubject<boolean>(false)
  constructor(private _http: HttpClient,private _env:EnvironmentService,private _router: Router) {}

  checkLogin(loginObj: any): Observable<any> {
    return this._http.post<any>('http://localhost:8085/api/user/login', loginObj);
  }

  signUp(signupObj: any): Observable<any> {
    return this._http.post<any>('http://localhost:8085/api/user/signup', signupObj);
  }
  retrieveUserInformation(): any {
    let user:  {};
    if (localStorage.getItem('userInfo')) {
      user = JSON.parse(localStorage.getItem('userInfo') || null);
    } else {
      user = {};
      localStorage.clear();
    }
    return user;
  }

  onUpdateUser(signupObj: any): Observable<any> {
    return this._http.post<any>('http://localhost:8085/api/user/updateUser', signupObj);
  }

  deleteUser(userId: any): Observable<any> {
    let user = {
      user_id: userId
    }
    return this._http.post<any>('http://localhost:8085/api/user/deleteUser',user);
  }

  handleRootRoutes(route: string): void {
    this._router.navigate([route]);
  }

}
