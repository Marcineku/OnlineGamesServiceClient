import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// 'http://localhost:8080/';
// 'http://192.168.0.248:8080/';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private apiUrl = 'http://localhost:8080/';

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req.clone({ url: this.apiUrl + req.url }));
  }
}

export const apiInterceptorProvider = {
  provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true
};
