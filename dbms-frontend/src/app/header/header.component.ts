import { Component, OnInit } from '@angular/core';
import e from 'express';
import { LoginService } from '../shared/services/login.service';
import { MessageService } from '../shared/services/message.service';
import { EMessageType } from '../shared/services/service-index';
import { Router } from '@angular/router';
import { log } from 'console';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  user: any = {};
  constructor(
    private _login: LoginService,
    private _message: MessageService,
    private _routing: Router
  ) {}
  ngOnInit(): void {
    this._login.isUserLoggedIn.subscribe((data) => {
      this.isUserPresent();
    });
  }
  isUserPresent(): void {
    if (this._login.retrieveUserInformation() === null) {
      this.isUserLoggedIn = false;
      this._message.showMessage({
        type: EMessageType.Failed,
        message: 'Session expired! Please login again...',
      });
      // this._login.handleRootRoutes('login');
    } else {
      this.user = this._login.retrieveUserInformation();
      this.isUserLoggedIn = true;
    }
  }
  logout() {
    this._login.isUserLoggedIn.next(false);
    this._login.handleRootRoutes('login');
    localStorage.removeItem('userInfo');
    this._message.showMessage({
      type: EMessageType.SUCCESS,
      message: 'Logged out successfully!',
    });
  }
  deleteUser(): void {
    let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this._login.deleteUser(user.user_id).subscribe((res) => {
      if (res.status) {
        this._message.showMessage({
          type: EMessageType.SUCCESS,
          message: res.message,
        });
        alert('User deleted successfully');
        localStorage.removeItem('userInfo');
        this._login.isUserLoggedIn.next(false);
        this._login.handleRootRoutes('login');
      } else {
        this._message.showMessage({
          type: EMessageType.Failed,
          message: res.message,
        });
      }
    });
  }

  updateUser(): void {

    this._login.handleRootRoutes('signup');
  }

  addAccount(): void {

    this._login.handleRootRoutes('account');
  }
  
}
