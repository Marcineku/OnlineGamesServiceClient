import { Injectable } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import {SessionStorageService} from './session-storage.service';

/*http://192.168.0.248:8080/*/
/*http://localhost:8080/*/

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class APIInterceptor implements HttpInterceptor {

  constructor(private storage: SessionStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiReq = req.clone({ url: `http://192.168.0.248:8080/${req.url}` });

    const token = this.storage.getToken();
    if (token) {
      apiReq = apiReq.clone({ headers: apiReq.headers.set(TOKEN_HEADER_KEY, this.storage.getTokenType() + ' ' + token) });
    }

    console.log(apiReq);

    return next.handle(apiReq);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true }
];
