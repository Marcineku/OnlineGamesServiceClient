import {Component, OnDestroy, OnInit} from '@angular/core';
import {GamesService, TicTacToeGameDTOResponse} from '../../../../../../services/games.service';
import {TicTacToeDTO} from '../../../../../../request-bodies/tic-tac-toe-d-t-o';
import {Subject, Subscription} from 'rxjs';
import {FormControl, Validators} from '@angular/forms';
import {StompService} from '../../../../../../services/stomp.service';

@Component({
  selector: 'app-tic-tac-toe-lobby',
  templateUrl: './tic-tac-toe-lobby.component.html',
  styleUrls: ['./tic-tac-toe-lobby.component.css']
})
export class TicTacToeLobbyComponent implements OnInit, OnDestroy {
  gameTypes = new FormControl('', [Validators.required]);
  gameTypesList: string[] = ['Singleplayer', 'Multiplayer'];
  pieceCodes = new FormControl('', [Validators.required]);
  pieceCodesList: string[] = ['X', 'O'];
  usernameFilter = '';
  isCreatingGameError = false;
  errorMessage = '';
  private gamesList: TicTacToeGameDTOResponse[] = [];
  private games = new Subject<TicTacToeGameDTOResponse[]>();
  games$ = this.games.asObservable();
  private createdGames: Subscription;

  constructor(private gamesService: GamesService,
              private stomp: StompService) {
  }

  ngOnInit() {
    this.createdGames = this.stomp.watchCreatedGames().subscribe(
      res => {
        this.gamesList.push(res);
        this.games.next(this.gamesList);
      }
    );

    this.gamesService.getAvailableGames().subscribe(
      res => {
        this.gamesList = res;
        this.games.next(this.gamesList);
      }
    );

    this.gamesService.getUserActiveGames().subscribe();
  }

  ngOnDestroy() {
    this.createdGames.unsubscribe();
  }

  createNewGame() {
    if (this.gameTypes.value.length === 0 || this.pieceCodes.value.length === 0 ||
      this.gameTypes.invalid || this.pieceCodes.invalid) {
      return;
    }

    this.gamesService.createGame(new TicTacToeDTO(this.gameTypes.value, this.pieceCodes.value)).subscribe(
      () => {
        this.isCreatingGameError = false;
      },
      err => {
        this.isCreatingGameError = true;
        switch (err.status) {
          case 0:
            this.errorMessage = `Couldn't connect to the server`;
            break;
          case 400:
            this.errorMessage = 'You cannot be owner of more games';
            break;
        }
      }
    );
  }

  onUsernameFilterUpdate() {
    this.games.next(this.gamesList.filter(game => game.firstPlayer.toLowerCase().startsWith(this.usernameFilter.toLowerCase())));
  }
}
