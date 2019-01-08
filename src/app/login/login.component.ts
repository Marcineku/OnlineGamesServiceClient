import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {SessionStorageService} from '../session-storage.service';
import {FormControl, Validators} from '@angular/forms';
import {LoginForm} from '../auth/login-form';

// TODO add logging animation

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = new FormControl('', [Validators.minLength(4), Validators.maxLength(20)]);
  password = new FormControl('', []);

  isLoggedIn = false;
  isLoginFailed = false;

  errorMessage = '';
  roles: string[] = [];

  constructor(private auth: AuthService, private storage: SessionStorageService) { }

  ngOnInit() {
    if (this.storage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.storage.getAuthorities();
    }
  }

  onLogin() {
    if (this.username.invalid) {
      return;
    }

    this.auth.attemptAuth(new LoginForm(this.username.value, this.password.value)).subscribe(
      data => {
        this.storage.saveToken(data.jwtToken);
        this.storage.saveTokenType(data.tokenType);
        this.storage.saveUsername(data.username);
        this.storage.saveAuthorities(data.authorities);

        this.isLoggedIn = true;
        this.isLoginFailed = false;
        this.roles = this.storage.getAuthorities();

        // TODO emit event instead
        window.location.reload();
      },
      error => {
        console.log(error);
        this.password.setValue('');
        this.isLoginFailed = true;

        switch (error.status) {
          case 0:
            this.errorMessage = 'Couldnt connect to the server';
            break;
          case 401:
            this.errorMessage = 'Invalid login or password';
            break;
        }
      }
    );
  }

  onLogout() {
    this.storage.clear();
    this.isLoggedIn = false;
    // TODO emit event instead
    window.location.reload();
  }

  getToken() {
    return this.storage.getToken();
  }

  getTokenType() {
    return this.storage.getTokenType();
  }

  getUsername() {
    return this.storage.getUsername();
  }

  getAuthorities() {
    return this.storage.getAuthorities();
  }
}
