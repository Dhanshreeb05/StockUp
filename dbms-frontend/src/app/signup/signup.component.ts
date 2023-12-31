import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../shared/services/login.service';
import { EnvironmentService } from '../shared/services/environment.service';
import { MessageService } from '../shared/services/message.service';
import { EMessageType } from '../shared/services/service-index';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = this._fb.group({
    user_email: [null, [Validators.required]],
    password: [null, [Validators.required]],
    first_name: [null, [Validators.required]],
    last_name: [null, [Validators.required]],
    street_name: [null, [Validators.required]],
    zip_code: [null, [Validators.required]],
    town: [null, [Validators.required]],
  });
  formType: string = '';

  assetsPath = this._env.assetsPath;
  hide: boolean = true; // Password hiding
  constructor(
    private _fb: FormBuilder,
    private _login: LoginService,
    private _env: EnvironmentService,
    private router: Router,
    private _message: MessageService
  ) {}

  ngOnInit(): void {
    this.formType = 'new';
    this.formInitializer('new');
    if(localStorage.getItem('userInfo')){
      this.formInitializer('edit');
      this.formType = 'edit';
    }
  }

  formInitializer(formType: string): void {
    switch (formType.toLowerCase()) {
      case 'new':
        this.signupForm = this._fb.group({
          user_email: [
            '',
            Validators.pattern('[A-Za-z0-9._]+@[A-Za-z0-9._]+\\.[a-z]{2,3}'),
          ],
          password: ['', [Validators.required]],
          first_name: ['', [Validators.required]],
          last_name: ['', [Validators.required]],
          street_no: ['', [Validators.required]],
          street_name: ['', [Validators.required]],
          zip_code: ['', [Validators.required]],
          town: ['', [Validators.required]],
        });
        break;
        case 'edit':
          let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
          this.signupForm = this._fb.group({
            user_email: [
              user.user_email,
              Validators.pattern('[A-Za-z0-9._]+@[A-Za-z0-9._]+\\.[a-z]{2,3}'),
            ],
            password: ['', [Validators.required]],
            first_name: [user.first_name, [Validators.required]],
            last_name: [user.last_name, [Validators.required]],
            street_no: [user.street_no, [Validators.required]],
            street_name: [user.street_name, [Validators.required]],
            zip_code: [user.zipcode, [Validators.required]],
            town: [user.town, [Validators.required]],
          });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  onSignup(formType:string): void {
    if(formType === 'edit'){

      this.onUpdateUser();
    }
    else{
      this.onAddUser();
    }

  }

  onUpdateUser():void{
    let userid = JSON.parse(localStorage.getItem('userInfo') || '{}').user_id;
    let signUpObj = {
      user_id: userid,
      user_email: this.signupForm.get('user_email').value,
      user_password: this.signupForm.get('password').value,
      first_name: this.signupForm.get('first_name').value,
      last_name: this.signupForm.get('last_name').value,
      street_name: this.signupForm.get('street_name').value,
      street_no: this.signupForm.get('street_no').value,
      zipcode: this.signupForm.get('zip_code').value,
      town: this.signupForm.get('town').value,
    };

    if (this.signupForm.valid) {
      this._login.onUpdateUser(signUpObj).subscribe((res) => {
        if (res.status) {
          alert(res.message);
          this._message.showMessage({
            type: EMessageType.Failed,
            message: 'Customer Updates Successfully',
          });
          this.router.navigate(['/dashboard']);
        } else {
  
          alert(res.message);
        }
      });
    }
  }
  

  onAddUser():void{
    
    let signUpObj = {
      user_email: this.signupForm.get('user_email').value,
      user_password: this.signupForm.get('password').value,
      first_name: this.signupForm.get('first_name').value,
      last_name: this.signupForm.get('last_name').value,
      street_name: this.signupForm.get('street_name').value,
      street_no: this.signupForm.get('street_no').value,
      zipcode: this.signupForm.get('zip_code').value,
      town: this.signupForm.get('town').value,
    };;

    if (this.signupForm.valid) {
      this._login.signUp(signUpObj).subscribe((res) => {
        if (res.status) {
          alert(res.message);
          this._message.showMessage({
            type: EMessageType.Failed,
            message: 'Customer Registered Successfully',
          });
          this.router.navigate(['/login']);
        } else {
          alert(res.message.sqlMessage);
        }
      });
    }
  }
}
