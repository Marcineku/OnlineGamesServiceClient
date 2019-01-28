import {Component, OnInit} from '@angular/core';
import {Gif, GiphyService} from '../../../../services/giphy.service';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css']
})
export class GamesListComponent implements OnInit {
  ticTacToeGiphyUrl: string;

  constructor(private giphy: GiphyService) {
  }

  ngOnInit() {
    this.giphy.getGif(Gif.TicTacToe).subscribe(
      res => {
        this.ticTacToeGiphyUrl = res;
      }
    );
  }
}
