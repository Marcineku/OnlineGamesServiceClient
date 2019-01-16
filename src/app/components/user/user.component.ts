import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTabChangeEvent} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';

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
export class UserComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  selectedTab = 0;
  isOpen = true;
  private logged: Subscription;
  private registered: Subscription;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();

    this.logged = this.auth.logged$.subscribe(
      logged => this.isLoggedIn = logged
    );

    this.registered = this.auth.registered$.subscribe(
      () => this.selectedTab = 0
    );
  }

  ngOnDestroy() {
    this.logged.unsubscribe();
    this.registered.unsubscribe();
  }

  onLogout() {
    this.auth.logout();
    this.isLoggedIn = false;
  }

  onSelectedTabChange(event: MatTabChangeEvent) {
    this.selectedTab = event.index;

    if (this.selectedTab === 0) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }
}
