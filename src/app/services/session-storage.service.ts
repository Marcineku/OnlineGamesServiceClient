import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const TOKEN_TYPE_KEY = 'AuthTokenType';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor() { }

  public setToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public setTokenType(tokenType: string) {
    window.sessionStorage.removeItem(TOKEN_TYPE_KEY);
    window.sessionStorage.setItem(TOKEN_TYPE_KEY, tokenType);
  }

  public getTokenType() {
    return sessionStorage.getItem(TOKEN_TYPE_KEY);
  }

  public setUsername(username: string) {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, username);
  }

  public getUsername(): string {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  public setAuthorities(authorities: string[]) {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    const roles = [];

    if (sessionStorage.getItem(TOKEN_KEY)) {
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        roles.push(authority.authority);
      });
    }

    return roles;
  }

  public clear() {
    window.sessionStorage.clear();
  }
}
