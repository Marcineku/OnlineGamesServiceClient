import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {concatMap, delay, retryWhen} from 'rxjs/operators';

// 'http://localhost:8080/';
// 'http://192.168.0.248:8080/';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private apiUrl = 'http://localhost:8080/';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req.clone({url: this.apiUrl + req.url})).pipe(
      retryWhen(errors => errors.pipe(
        concatMap((err, i) => {
          if (err.status === 0) {
            if (i < 2) {
              return of(err);
            }
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
