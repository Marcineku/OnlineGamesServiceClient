import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionStorageService } from '../services/session-storage.service';

export const LOCALHOST_ADDRESS = 'http://localhost:8080/';
export const HOME_LAN_ADDRESS = 'http://192.168.0.248:8080/';

export const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  private address = LOCALHOST_ADDRESS;

  constructor(private sessionStorageService: SessionStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiReq = req.clone({ url: this.address + req.url });

    const token = this.sessionStorageService.getToken();
    if (token) {
      apiReq = apiReq.clone({ headers: apiReq.headers.set(TOKEN_HEADER_KEY, this.sessionStorageService.getTokenType() + ' ' + token) });
    }

    return next.handle(apiReq);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true }
];
