import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {TicTacToeDTO} from './games/tic-tac-toe-d-t-o';

export interface News {
  id: number;
  type: string;
  title: string;
  text: string;
  publicationDate: string;
  language: string;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private newsUrl = 'news';

  constructor(private http: HttpClient) { }

  public getNews(): Observable<any> {
    return this.http.get(this.newsUrl);
  }

  public createGame(gameDto: TicTacToeDTO): Observable<string> {
    return this.http.post<string>('games/tictactoe', gameDto, httpOptions);
  }
}
