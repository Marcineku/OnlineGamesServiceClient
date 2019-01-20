import {Component, OnInit, ViewChild} from '@angular/core';
import {GamesService, TicTacToeGameDTOResponse} from '../../../../../../services/games.service';
import {TicTacToeDTO} from '../../../../../../request-bodies/tic-tac-toe-d-t-o';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {ChatMessage} from '../../../../../../services/stomp.service';
import {Subject} from 'rxjs';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-tic-tac-toe-lobby',
  templateUrl: './tic-tac-toe-lobby.component.html',
  styleUrls: ['./tic-tac-toe-lobby.component.css']
})
export class TicTacToeLobbyComponent implements OnInit {
  private gamesList: TicTacToeGameDTOResponse[] = [];
  private games = new Subject<TicTacToeGameDTOResponse[]>();
  games$ = this.games.asObservable();
  gameTypes = new FormControl('', [Validators.required]);
  gameTypesList: string[] = ['Singleplayer', 'Multiplayer'];
  pieceCodes = new FormControl('', [Validators.required]);
  pieceCodesList: string[] = ['X', 'O'];

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

  createNewGame() {
    if (this.gameTypes.value.length === 0 || this.pieceCodes.value.length === 0 ||
        this.gameTypes.invalid || this.pieceCodes.invalid) {
      return;
    }

    this.gamesService.createGame(new TicTacToeDTO(this.gameTypes.value, this.pieceCodes.value)).subscribe();
  }
}
