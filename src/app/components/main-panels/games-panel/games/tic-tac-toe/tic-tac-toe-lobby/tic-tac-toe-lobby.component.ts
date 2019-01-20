import {Component, OnInit, ViewChild} from '@angular/core';
import {GamesService, TicTacToeGameDTOResponse} from '../../../../../../services/games.service';
import {TicTacToeDTO} from '../../../../../../request-bodies/tic-tac-toe-d-t-o';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {ChatMessage} from '../../../../../../services/stomp.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-tic-tac-toe-lobby',
  templateUrl: './tic-tac-toe-lobby.component.html',
  styleUrls: ['./tic-tac-toe-lobby.component.css']
})
export class TicTacToeLobbyComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  virtualScrollViewport: CdkVirtualScrollViewport;
  private gamesList: TicTacToeGameDTOResponse[] = [];
  private games = new Subject<TicTacToeGameDTOResponse[]>();
  games$ = this.games.asObservable();

  constructor(private gamesService: GamesService) {
  }

  ngOnInit() {
    this.gamesService.getAvailableGames().subscribe(
      res => {
        this.gamesList = res;
        this.games.next(this.gamesList);
      }
    );
  }

  createNewGame(gameType: string, pieceCode: string) {
    this.gamesService.createGame(new TicTacToeDTO(gameType, pieceCode)).subscribe();
  }
}
