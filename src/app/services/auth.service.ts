import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginForm } from '../request-bodies/login-form';
import { Observable } from 'rxjs';
import {RegistrationForm} from '../request-bodies/registration-form';

export interface JwtResponse {
  jwtToken: string;
  tokenType: string;
  username: string;
  authorities: string[];
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  attemptAuth(loginForm: LoginForm): Observable<JwtResponse> {
    return this.http.post<JwtResponse>('auth/signin', loginForm, httpOptions);
  }

  register(registrationForm: RegistrationForm): Observable<string> {
    return this.http.post('auth/signup', registrationForm, { responseType: 'text' } );
  }
}

export const ROLE = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN'
};
