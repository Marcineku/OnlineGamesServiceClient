import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoginForm} from './login-form';
import {Observable} from 'rxjs';
import {JwtResponse} from './jwt-response';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  attemptAuth(credentials: LoginForm): Observable<JwtResponse> {
    return this.http.post<JwtResponse>('auth/signin', credentials, httpOptions);
  }
}
