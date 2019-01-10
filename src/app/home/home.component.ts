import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { SessionStorageService } from '../services/session-storage.service';
import {MatTabChangeEvent} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  username = 'User';
  isLoggedIn = false;
  selectedTab = 0;

  private mobileQueryListener;

  constructor(private sessionStorageService: SessionStorageService,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher) { }

  ngOnInit() {
    if (this.sessionStorageService.getToken()) {
      this.username = this.sessionStorageService.getUsername();
      this.isLoggedIn = true;
      this.selectedTab = 1;
    }

    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('mobileQueryListener', this.mobileQueryListener());
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('mobileQueryListener', this.mobileQueryListener());
  }

  onLogged(logged: boolean) {
    this.isLoggedIn = logged;

    if (this.isLoggedIn === true) {
      this.username = this.sessionStorageService.getUsername();
      this.selectedTab = 1;
    } else {
      this.username = 'User';
      this.selectedTab = 0;
    }
  }

  onSelectedTabChange(event: MatTabChangeEvent) {
    this.selectedTab = event.index;
  }
}
