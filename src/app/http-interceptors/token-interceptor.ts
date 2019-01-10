import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SessionStorageService} from '../services/session-storage.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private sessionStorageService: SessionStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;

    const token = this.sessionStorageService.getToken();
    if (token) {
      const tokenType = this.sessionStorageService.getTokenType();
      authReq = req.clone({ headers: authReq.headers.set(TOKEN_HEADER_KEY, tokenType + ' ' + token) });
    }

    return next.handle(authReq);
  }
}

export const tokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
};
