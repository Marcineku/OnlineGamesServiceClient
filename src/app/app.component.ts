import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SessionStorageService} from './services/session-storage.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from './services/auth.service';
import {Subscription} from 'rxjs';
import {StompService} from './services/stomp.service';
import {Gif, GiphyService} from './services/giphy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  username: string;
  isLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  stompState: string;
  private mobileQueryListener;
  private logged: Subscription;
  private stompErrors: Subscription;
  private stompConnectionState: Subscription;
  locale: string;
  americanFlagGiphyUrl: string;
  polishFlagGiphyUrl: string;
  lightTheme: boolean;

  constructor(private sessionStorage: SessionStorageService,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher,
              private auth: AuthService,
              private stomp: StompService,
              private giphy: GiphyService) {
  }

  ngOnInit() {
    const theme = this.sessionStorage.getTheme();
    this.lightTheme = theme !== 'dark';

    this.giphy.getGif(Gif.AmericanFlag).subscribe(
      res => {
        this.americanFlagGiphyUrl = res;
      }
    );

    this.giphy.getGif(Gif.PolishFlag).subscribe(
      res => {
        this.polishFlagGiphyUrl = res;
      }
    );

    this.locale = this.sessionStorage.getLocale();

    this.stompErrors = this.stomp.getConnectionErrors().subscribe(
      () => {
        this.stomp.disconnect();
        if (this.auth.isLoggedIn()) {
          this.auth.logout();
        }
      }
    );

    this.stompConnectionState = this.stomp.getConnectionState().subscribe(
      res => {
        this.stompState = res;
      }
    );

    this.onLogged(this.auth.isLoggedIn());

    this.logged = this.auth.logged$.subscribe(
      logged => {
        this.onLogged(logged);
      });

    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('mobileQueryListener', this.mobileQueryListener());
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('mobileQueryListener', this.mobileQueryListener());
    this.logged.unsubscribe();
    this.stomp.disconnect();
    this.stompErrors.unsubscribe();
    this.stompConnectionState.unsubscribe();
  }

  onSetLocale(locale: string) {
    if (this.locale !== locale) {
      this.sessionStorage.setLocale(locale);
    }
  }

  onChangeStyle() {
    if (this.lightTheme) {
      this.lightTheme = false;
    } else {
      this.lightTheme = true;
    }
  }

  private onLogged(logged: boolean) {
    this.isLoggedIn = logged;
    this.isAdminLoggedIn = this.auth.isAdminLoggedIn();

    if (this.isLoggedIn) {
      this.username = this.sessionStorage.getUsername();
      this.stomp.connect();
    } else {
      this.username = 'User';
      this.stomp.disconnect();
    }
  }
}
