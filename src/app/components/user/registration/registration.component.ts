import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {AuthService} from '../../../services/auth.service';
import {RegistrationForm} from '../../../request-bodies/registration-form';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  passwordForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  username = new FormControl('', [Validators.minLength(4), Validators.maxLength(20), Validators.required]);
  email = new FormControl('', [Validators.maxLength(30), Validators.email, Validators.required]);
  roles = new FormControl('', [Validators.required]);
  rolesList: string[] = ['User', 'Admin'];

  isRegistrationFailed = false;

  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private auth: AuthService) {
  }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.minLength(6), Validators.maxLength(16), Validators.required]],
      confirmPassword: ['']
    }, {validator: this.checkPasswords});
  }

  onRegister() {
    if (this.username.value.length === 0 || this.email.value.length === 0 || this.roles.value.length === 0 ||
      this.passwordForm.value.password.length === 0 || this.passwordForm.value.confirmPassword.length === 0 ||
      this.username.invalid || this.email.invalid || this.roles.invalid || this.passwordForm.invalid) {
      return;
    }

    this.auth.register(new RegistrationForm(this.username.value, this.email.value,
      this.roles.value, this.passwordForm.value.password)).subscribe(
      () => {
        this.email.reset();
        this.roles.reset();
        this.isRegistrationFailed = false;
      },
      err => {
        this.isRegistrationFailed = true;

        switch (err.status) {
          case 0:
            this.errorMessage = `Couldn't connect to the server`;
            break;
          case 400:
          case 401:
            this.errorMessage = 'User with that name already exists';
            break;
        }
      },
      () => {
        this.username.reset();
        this.passwordForm.reset();
      }
    );
  }

  private checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : {notSame: true};
  }
}

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
