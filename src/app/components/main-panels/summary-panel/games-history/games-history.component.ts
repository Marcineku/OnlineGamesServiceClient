import {Component, OnInit} from '@angular/core';
import {GamesService, TicTacToeGameInfo} from '../../../../services/games.service';
import {Subject} from 'rxjs';
import {SessionStorageService} from '../../../../services/session-storage.service';
import {MatTableDataSource} from '@angular/material';

export interface GameStatisticElement {
  name: string;
  value: string;
}

@Component({
  selector: 'app-games-history',
  templateUrl: './games-history.component.html',
  styleUrls: ['./games-history.component.css']
})
export class GamesHistoryComponent implements OnInit {
  gamesPlayed = 0;
  gamesWon = 0;
  gamesLost = 0;
  gamesDraws = 0;
  winRate = 0;
  dataSource: MatTableDataSource<GameStatisticElement>;
  displayedColumns: string[] = ['name', 'value'];
  username;
  private gamesHistoryList: TicTacToeGameInfo[] = [];
  private gamesHistory = new Subject<TicTacToeGameInfo[]>();
  gamesHistory$ = this.gamesHistory.asObservable();

  constructor(private gamesService: GamesService,
              private sessionStorage: SessionStorageService) {
  }

  ngOnInit() {
    this.username = this.sessionStorage.getUsername();

    this.gamesService.getGamesHistory().subscribe(
      res => {
        // List of played games
        this.gamesHistoryList = res;
        this.gamesHistory.next(this.gamesHistoryList);

        // Amount of games played
        this.gamesPlayed = res.length;

        // Win rate
        res.forEach(game => {
          let winnerName = '';
          let looserName = '';
          if (game.gameStatus === 'FIRST_PLAYER_WON') {
            winnerName = game.firstPlayer;
            looserName = game.secondPlayer;
          } else if (game.gameStatus === 'SECOND_PLAYER_WON') {
            winnerName = game.secondPlayer;
            looserName = game.firstPlayer;
          }

          if (winnerName === this.username) {
            this.gamesWon += 1;
          } else if (looserName === this.username) {
            this.gamesLost += 1;
          } else {
            this.gamesDraws += 1;
          }
        });
        this.winRate = this.gamesWon / this.gamesPlayed * 100;

        const data: GameStatisticElement[] = [
          {
            name: 'played',
            value: this.gamesPlayed + ''
          },
          {
            name: 'won',
            value: this.gamesWon + ''
          },
          {
            name: 'lost',
            value: this.gamesLost + ''
          },
          {
            name: 'draws',
            value: this.gamesDraws + ''
          },
          {
            name: 'win rate',
            value: this.winRate.toPrecision(4) + '%'
          }
        ];

        this.dataSource = new MatTableDataSource(data);
      }
    );
  }
}
