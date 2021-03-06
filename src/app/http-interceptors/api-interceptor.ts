import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {concatMap, delay, retryWhen} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {SessionStorageService} from '../services/session-storage.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private apiUrl = 'http://localhost:8080/';

  constructor(private auth: AuthService,
              private sessionStorage: SessionStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has(InterceptorSkipHeader)) {
      const headers = req.headers.delete(InterceptorSkipHeader);
      return next.handle(req.clone({headers}));
    }

    const token = this.sessionStorage.getToken();
    if (token) {
      const tokenType = this.sessionStorage.getTokenType();
      req = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, tokenType + ' ' + token)});
    }

    return next.handle(req.clone({url: this.apiUrl + req.url})).pipe(
      retryWhen(errors => errors.pipe(
        concatMap((err, i) => {
          switch (err.status) {
            case 0:
              return of(err);
            case 401:
              this.auth.logout();
              return throwError(err);
          }
          return throwError(err);
        }),
        delay(2000)
      ))
    );
  }
}

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

export const apiInterceptorProvider = {
  provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true
};
