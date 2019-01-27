import {Component, OnDestroy, OnInit} from '@angular/core';
import {GamesService, TicTacToeGameInfo} from '../../../../../../services/games.service';
import {TicTacToeDTO} from '../../../../../../request-bodies/tic-tac-toe-d-t-o';
import {Subject, Subscription} from 'rxjs';
import {FormControl, Validators} from '@angular/forms';
import {StompService} from '../../../../../../services/stomp.service';
import {SessionStorageService} from '../../../../../../services/session-storage.service';
import {Router} from '@angular/router';

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
  creatingErrorMessage = '';
  private gamesMap: Map<number, TicTacToeGameInfo> = new Map();
  private games = new Subject<TicTacToeGameInfo[]>();
  games$ = this.games.asObservable();
  private createdGames: Subscription;
  private updatedGames: Subscription;
  private deletedGames: Subscription;
  private gamesListAcquired = false;
  private eventsBeforeAcquisition: Event[] = [];
  private username;

  constructor(private gamesService: GamesService,
              private stomp: StompService,
              private sessionStorage: SessionStorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.username = this.sessionStorage.getUsername();

    this.createdGames = this.stomp.watchCreatedGames().subscribe(
      res => {
        if (this.gamesListAcquired) {
          this.gamesMap.set(res.gameId, res);
          this.games.next(Array.from(this.gamesMap.values()));
        } else {
          this.eventsBeforeAcquisition.push(new Event('add', res));
        }
      }
    );

    this.updatedGames = this.stomp.watchUpdatedGames().subscribe(
      res => {
        if (this.gamesListAcquired) {
          this.gamesMap.set(res.gameId, res);
          this.games.next(Array.from(this.gamesMap.values()));
        } else {
          this.eventsBeforeAcquisition.push(new Event('update', res));
        }
      }
    );

    this.deletedGames = this.stomp.watchDeletedGames().subscribe(
      res => {
        if (this.gamesListAcquired) {
          this.gamesMap.delete(res);
          this.games.next(Array.from(this.gamesMap.values()));
        } else {
          this.eventsBeforeAcquisition.push(new Event('delete', res));
        }
      }
    );

    this.gamesService.getAvailableGames().subscribe(
      res => {
        res.forEach(game => this.gamesMap.set(game.gameId, game));

        this.eventsBeforeAcquisition.forEach(event => {
          switch (event.type) {
            case 'add':
              const addition = (event.event as TicTacToeGameInfo);
              this.gamesMap.set(addition.gameId, addition);
              break;
            case 'update':
              const update = (event.event as TicTacToeGameInfo);
              this.gamesMap.set(addition.gameId, update);
              break;
            case 'delete':
              const gameId = (event.event as number);
              this.gamesMap.delete(gameId);
              break;
          }
        });

        this.gamesMap.forEach(game => {
          if (game.gameStatus === 'IN_PROGRESS' &&
            game.secondPlayer === this.username) {
            this.router.navigate([`/games/tic-tac-toe/${game.gameId}`]).then(
              () => {
                console.log(`Navigating to '/games/tic-tac-toe/${game.gameId}'`);
              },
              reason => {
                console.error(`Navigating to '/games/tic-tac-toe/${game.gameId}' failed`, reason);
              });
          }
        });

        this.games.next(Array.from(this.gamesMap.values()));
        this.gamesListAcquired = true;
      }
    );

    this.gamesService.getUserActiveGames().subscribe();
  }

  ngOnDestroy() {
    this.createdGames.unsubscribe();
    this.updatedGames.unsubscribe();
    this.deletedGames.unsubscribe();
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
            this.creatingErrorMessage = `Couldn't connect to the server`;
            break;
          case 400:
            this.creatingErrorMessage = 'You cannot be owner of more games';
            break;
        }
      }
    );
  }

  onUsernameFilterUpdate() {
    this.games.next((Array.from(this.gamesMap.values()))
      .filter(game => game.firstPlayer.toLowerCase().startsWith(this.usernameFilter.toLowerCase())));
  }
}

class Event {
  type: string;
  event: any;

  constructor(type: string, event: any) {
    this.type = type;
    this.event = event;
  }
}
