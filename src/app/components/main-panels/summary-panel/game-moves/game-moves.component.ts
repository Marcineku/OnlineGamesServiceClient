import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {GamesService, TicTacToeGameInfo, TicTacToeMove} from '../../../../services/games.service';
import {SessionStorageService} from '../../../../services/session-storage.service';
import {Board, FieldState} from '../../games-panel/games/tic-tac-toe/tic-tac-toe-game/tic-tac-toe-game.component';

@Component({
  selector: 'app-game-moves',
  templateUrl: './game-moves.component.html',
  styleUrls: ['./game-moves.component.css']
})
export class GameMovesComponent implements OnInit, OnDestroy {
  gameMoves: TicTacToeMove[] = [];
  boards: Board[] = [];
  boardsWithMoves: BoardWithMove[] = [];
  gameInfo: TicTacToeGameInfo;
  username: string;
  private gameId: number;
  private paramMap$: Subscription;

  constructor(private route: ActivatedRoute,
              private gamesService: GamesService,
              private sessionStorage: SessionStorageService) {
  }

  ngOnInit() {
    this.username = this.sessionStorage.getUsername();

    this.paramMap$ = this.route.paramMap.subscribe(
      params => {
        this.gameId = +params.get('id');
      }
    );

    this.gamesService.getGameMoves(this.gameId).subscribe(
      res => {
        this.gameMoves = res;

        this.gamesService.getGameInfo(res[0].gameId).subscribe(
          res2 => {
            this.gameInfo = res2;

            const moves: Move[] = [];
            for (let i = 0; i < this.gameMoves.length; ++i) {
              const gameMove = this.gameMoves[i];

              const board = new Board(200, 200);

              let fieldState: FieldState;
              if (gameMove.username === this.gameInfo.firstPlayer) {
                if (this.gameInfo.firstPlayerPieceCode.toLowerCase() === 'x') {
                  fieldState = FieldState.Cross;
                } else {
                  fieldState = FieldState.Circle;
                }
              } else if (gameMove.username === this.gameInfo.secondPlayer) {
                if (this.gameInfo.firstPlayerPieceCode.toLowerCase() === 'x') {
                  fieldState = FieldState.Circle;
                } else {
                  fieldState = FieldState.Cross;
                }
              }
              const move = new Move(gameMove.field, fieldState);
              moves.push(move);

              for (let j = 0; j < moves.length; ++j) {
                const mv = moves[j];
                board.fields[mv.field].fieldState = mv.fieldState;

                if (j === moves.length - 1) {
                  board.fields[mv.field].stroke = 'green';
                }
              }

              this.boards.push(board);
              this.boardsWithMoves.push(new BoardWithMove(gameMove, board));
            }
          }
        );
      }
    );
  }

  ngOnDestroy() {
    this.paramMap$.unsubscribe();
  }
}

class Move {
  field: number;
  fieldState: FieldState;

  constructor(field: number, fieldState: FieldState) {
    this.field = field;
    this.fieldState = fieldState;
  }
}

class BoardWithMove {
  move: TicTacToeMove;
  board: Board;

  constructor(move: TicTacToeMove, board: Board) {
    this.move = move;
    this.board = board;
  }
}
