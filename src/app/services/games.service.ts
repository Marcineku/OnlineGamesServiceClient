import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TicTacToeDTO} from '../request-bodies/tic-tac-toe-d-t-o';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

export interface TicTacToeGameDTOResponse {
  gameId: number;
  created: Date;
  firstPlayer: string;
  secondPlayer: string;
  firstPlayerPieceCode: string;
  gameType: string;
  gameStatus: string;
}

const httpHeaders: HttpHeaders = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  createGame(gameDto: TicTacToeDTO): Observable<TicTacToeGameDTOResponse> {
    return this.http.post<TicTacToeGameDTOResponse>('games/tictactoe', gameDto, {headers: httpHeaders}).pipe(
      tap(res => {
        this.router.navigate([`/games/tic-tac-toe/${res.gameId}`]).then(
          () => {
            console.log(`Navigating to '/games/tic-tac-toe/${res.gameId}'`);
          },
          reason => {
            console.error(`Navigating to '/games/tic-tac-toe/${res.gameId}' failed`, reason);
          });
      })
    );
  }

  getAvailableGames(): Observable<TicTacToeGameDTOResponse[]> {
    return this.http.get<TicTacToeGameDTOResponse[]>('games/tictactoe/list');
  }
}
