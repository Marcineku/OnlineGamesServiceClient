import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SessionStorageService} from '../services/session-storage.service';
import {MatTabChangeEvent} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LoginComponent} from '../login/login.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({})),
      state('closed', style({
        height: 0,
        opacity: 0,
        margin: 0
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ]),
  ]
})
export class UserComponent implements OnInit {
  @ViewChild(LoginComponent) private loginComponent: LoginComponent;
  @Output() logged = new EventEmitter<boolean>();
  isLoggedIn = false;
  selectedTab = 0;
  isOpen = true;

  constructor(private sessionStorageService: SessionStorageService) { }

  ngOnInit() {
    if (this.sessionStorageService.getToken()) {
      this.isLoggedIn = true;
    }
  }

  onLogin() {
    this.isLoggedIn = true;
    this.logged.emit(this.isLoggedIn);
  }

  onLogout() {
    this.sessionStorageService.clear();
    this.isLoggedIn = false;
    this.logged.emit(this.isLoggedIn);
  }

  onSelectedTabChange(event: MatTabChangeEvent) {
    this.selectedTab = event.index;

    if (this.selectedTab === 0) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  onRegistered() {
    this.selectedTab = 0;
    this.loginComponent.registered = true;
  }
}
