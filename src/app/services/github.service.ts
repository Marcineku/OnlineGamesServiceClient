import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Traffic {
  count: number;
  uniques: number;
  views: Views[];
}

export interface Views {
  timestamp: Date;
  count: number;
  uniques: number;
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private http: HttpClient) {
  }

  getClientTraffic(): Observable<Traffic> {
    return this.http.get<Traffic>('github/traffic/client');
  }

  getServerTraffic(): Observable<Traffic> {
    return this.http.get<Traffic>('github/traffic/server');
  }
}
