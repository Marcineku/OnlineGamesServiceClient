import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoginForm} from '../request-bodies/login-form';
import {Observable, Subject, throwError} from 'rxjs';
import {RegistrationForm} from '../request-bodies/registration-form';
import {SessionStorageService} from './session-storage.service';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

interface JwtResponse {
  jwtToken: string;
  tokenType: string;
  username: string;
  authorities: string[];
}

const httpHeaders: HttpHeaders = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logged = new Subject<boolean>();
  logged$ = this.logged.asObservable();
  private registered = new Subject();
  registered$ = this.registered.asObservable();

  constructor(private http: HttpClient,
              private sessionStorage: SessionStorageService,
              private router: Router) {
  }

  login(loginForm: LoginForm): Observable<JwtResponse> {
    return this.http.post<JwtResponse>('auth/signin', loginForm, {headers: httpHeaders}).pipe(
      tap(res => {
        console.log('User has logged in', res);

        this.sessionStorage.setToken(res.jwtToken);
        this.sessionStorage.setTokenType(res.tokenType);
        this.sessionStorage.setUsername(res.username);
        this.sessionStorage.setAuthorities(res.authorities);

        this.logged.next(true);

        if (this.isAdminLoggedIn()) {
          this.router.navigate(['/admin']).then(
            () => {
              console.log(`Navigating to '/admin'`);
            },
            reason => {
              console.error(`Navigating to '/admin' failed`, reason);
            });
        } else {
          this.router.navigate(['/games']).then(
            () => {
              console.log(`Navigating to '/games'`);
            },
            reason => {
              console.error(`Navigating to '/games' failed`, reason);
            });
        }
      }),
      catchError(err => {
        console.error('Login error', err);
        return throwError(err);
      }));
  }

  logout() {
    console.log('User has logged out');
    this.sessionStorage.clear();
    this.logged.next(false);

    this.router.navigate(['/news']).then(
      () => {
        console.log(`Navigating to '/news'`);
      },
      reason => {
        console.error(`Navigating to '/news' failed`, reason);
      }
    );
  }

  register(registrationForm: RegistrationForm): Observable<string> {
    return this.http.post('auth/signup', registrationForm, {headers: httpHeaders, responseType: 'text'}).pipe(
      tap(() => {
        console.log('User has registered');
        this.registered.next();
      }),
      catchError(err => {
        console.error('Registration error', err);
        return throwError(err);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.sessionStorage.getToken();
  }

  isAdminLoggedIn(): boolean {
    return this.sessionStorage.getToken() ? this.sessionStorage.getAuthorities().includes(ROLE.ADMIN) : false;
  }
}

export const ROLE = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN'
};
