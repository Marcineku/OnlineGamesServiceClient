import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';
import { TicTacToeDTO } from './tic-tac-toe-d-t-o';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  gameInfo: any = '';

  constructor(private app: AppService) { }

  ngOnInit() {
  }

  createNewGame(gameType: string, pieceCode: string) {
    this.app.createGame(new TicTacToeDTO(gameType, pieceCode)).subscribe(
      data => {
        console.log(data);
        this.gameInfo = data;
      },
      error => {
        console.log(error);
        this.gameInfo = 'Error';
      }
    );
  }
}
