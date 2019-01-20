import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {FormControl, Validators} from '@angular/forms';
import {LoginForm} from '../../../request-bodies/login-form';
import {Subscription} from 'rxjs';

// TODO add logging animation

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  username = new FormControl('', [Validators.minLength(4), Validators.maxLength(20), Validators.required]);
  password = new FormControl('', [Validators.required]);
  justRegistered = false;
  isLoginFailed = false;
  errorMessage = '';
  private registered: Subscription;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.registered = this.auth.registered$.subscribe(
      () => {
        this.username.reset();
        this.password.reset();
        this.isLoginFailed = false;
        this.justRegistered = true;
      }
    );
  }

  ngOnDestroy() {
    this.registered.unsubscribe();
  }

  onLogin() {
    if (this.justRegistered) {
      this.justRegistered = false;
    }

    if (this.username.value.length === 0 || this.username.value.length === 0 ||
      this.username.invalid || this.password.invalid) {
      return;
    }

    this.auth.login(new LoginForm(this.username.value, this.password.value)).subscribe(
      () => {
        this.isLoginFailed = false;
      },
      err => {
        this.isLoginFailed = true;

        switch (err.status) {
          case 0:
            this.errorMessage = `Couldn't connect to the server`;
            break;
          case 400:
          case 401:
            this.errorMessage = 'Invalid login or password';
            break;
          case 500:
            this.errorMessage = 'This user is already logged in';
            break;
        }
      },
      () => {
        this.password.reset();
      }
    );
  }
}
