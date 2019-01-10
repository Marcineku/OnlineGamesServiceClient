import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {SessionStorageService} from '../../services/session-storage.service';
import {FormControl, Validators} from '@angular/forms';
import {LoginForm} from '../../request-bodies/login-form';

// TODO add logging animation

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = new FormControl('', [Validators.minLength(4), Validators.maxLength(20), Validators.required]);
  password = new FormControl('', [Validators.required]);

  @Input() set registered(registered: boolean) {
    if (registered) {
      this.username.reset();
      this.password.reset();
      this.isLoginFailed = false;
      this.isRegistered = true;
    } else {
      this.isRegistered = false;
    }
  }
  isRegistered = false;

  @Output() loggedIn = new EventEmitter();
  isLoginFailed = false;

  errorMessage = '';

  constructor(private auth: AuthService, private sessionStorageService: SessionStorageService) { }

  ngOnInit() { }

  onLogin() {
    if (this.isRegistered) {
      this.isRegistered = false;
    }

    if (this.username.value.length === 0 || this.username.value.length === 0 ||
        this.username.invalid || this.password.invalid) {
      return;
    }

    this.auth.attemptAuth(new LoginForm(this.username.value, this.password.value)).subscribe(
      data => {
        this.sessionStorageService.setToken(data.jwtToken);
        this.sessionStorageService.setTokenType(data.tokenType);
        this.sessionStorageService.setUsername(data.username);
        this.sessionStorageService.setAuthorities(data.authorities);

        this.password.reset();
        this.isLoginFailed = false;
        this.loggedIn.emit();
      },
      error => {
        console.log(error);
        this.password.reset();
        this.isLoginFailed = true;

        switch (error.status) {
          case 0:
            this.errorMessage = 'Couldnt connect to the server';
            break;
          case 400:
          case 401:
            this.errorMessage = 'Invalid login or password';
            break;
        }
      }
    );
  }
}
