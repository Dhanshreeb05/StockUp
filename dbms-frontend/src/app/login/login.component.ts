import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EMessageType, EnvironmentService ,LoginService, MessageService} from '../shared/services/service-index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this._fb.group({
    email: [null, [Validators.required]],
    password: [null, [Validators.required]],
  });
  assetsPath = this._environment.assetsPath;

  hide: boolean = true; // Password hiding
  constructor(
    private _environment: EnvironmentService,
    private _fb: FormBuilder,
    private _login: LoginService,
    private router: Router,
    private _message: MessageService
  ) {}

  ngOnInit(): void {
    this.formInitializer('new');
  }

  formInitializer(formType: string): void {
    switch (formType.toLowerCase()) {
      case 'new':
        this.loginForm = this._fb.group({
          email: [
            '',
            Validators.pattern('[A-Za-z0-9._]+@[A-Za-z0-9._]+\\.[a-z]{2,3}'),
          ],
          password: ['', [Validators.required]],
        });
        break;
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onLogin(): void {
    let checkLoginObj = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    };
    if (this.loginForm.valid) {
      this._login.checkLogin(checkLoginObj).subscribe((res) => {
        if (res.status) {
          this._message.showMessage({
            type: EMessageType.SUCCESS,
            message: res.message,
          });
          this.router.navigate(['/dashboard']);          
          this._login.isUserLoggedIn.next(true);
          localStorage.setItem('userInfo', JSON.stringify(res.user));
        } else {
          alert(res.message);
        }
      });
    }
  }
  onSignup(): void {
    this.router.navigate(['/signup']);
  }

  markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    // tslint:disable-next-line:forin
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }


}
