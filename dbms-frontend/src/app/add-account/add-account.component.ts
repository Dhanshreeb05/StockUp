import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilityService } from '../shared/services/utility.service';
import { LoginService } from '../shared/services/login.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.scss',
})
export class AddAccountComponent implements OnInit {
  public ClientForm: FormGroup;
  public formErrors = {
    bankname: '',
    accnumber: '',
    routingnumber: '',
  };

  constructor(
    public form: FormBuilder,
    private _util: UtilityService,
    private _login: LoginService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  public onSubmit() {
    let bankDetails = {
      p_user_id: JSON.parse(localStorage.getItem('userInfo')).user_id,
      p_account_id: this.ClientForm.get('accnumber').value,
      p_bank_name: this.ClientForm.get('bankname').value,
      p_routing_number: this.ClientForm.get('routingnumber').value,
    };
    this._util.setBankAccount(bankDetails).subscribe((res) => {
      if (res.status) {
        alert('Bank account added successfully');
        this._login.handleRootRoutes('dashboard');
      } else {
        alert('Bank account not added');
      }
    });
  }

  public buildForm() {
    this.ClientForm = this.form.group({
      bankname: ['', [Validators.required]],
      accnumber: ['', [Validators.required]],
      routingnumber: ['', [Validators.required]],
    });
  }
}
