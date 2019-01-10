import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TicTacToeDTO } from '../request-bodies/tic-tac-toe-d-t-o';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private http: HttpClient) { }

  public createGame(gameDto: TicTacToeDTO): Observable<string> {
    return this.http.post('games/tictactoe', gameDto,  { responseType: 'text' } );
  }
}
