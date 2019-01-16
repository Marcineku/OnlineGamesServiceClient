import { Component, OnInit } from '@angular/core';
import {GamesService} from '../../../../../services/games.service';
import {TicTacToeDTO} from '../../../../../request-bodies/tic-tac-toe-d-t-o';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit {
  gameInfo: any = '';

  constructor(private gamesService: GamesService) {
  }

  ngOnInit() {
  }

  createNewGame(gameType: string, pieceCode: string) {
    this.gamesService.createGame(new TicTacToeDTO(gameType, pieceCode)).subscribe(
      data => {
        this.gameInfo = data;
      },
      error => {
        console.log(error);
        this.gameInfo = 'Error';
      }
    );
  }
}
