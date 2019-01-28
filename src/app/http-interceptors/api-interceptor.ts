import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {concatMap, delay, retryWhen} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';

// 'http://localhost:8080/';
// 'http://192.168.0.248:8080/';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private apiUrl = 'http://localhost:8080/';

  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has(InterceptorSkipHeader)) {
      const headers = req.headers.delete(InterceptorSkipHeader);
      return next.handle(req.clone({headers}));
    }

    return next.handle(req.clone({url: this.apiUrl + req.url})).pipe(
      retryWhen(errors => errors.pipe(
        concatMap((err, i) => {
          switch (err.status) {
            case 0:
              if (i < 2) {
                return of(err);
              }
              break;
            case 401:
              this.auth.logout();
              break;
          }
          return throwError(err);
        }),
        delay(1000)
      ))
    );
  }
}

export const apiInterceptorProvider = {
  provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true
};
