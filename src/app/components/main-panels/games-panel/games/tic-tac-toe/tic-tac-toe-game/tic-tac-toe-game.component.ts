import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tic-tac-toe-game',
  templateUrl: './tic-tac-toe-game.component.html',
  styleUrls: ['./tic-tac-toe-game.component.css']
})
export class TicTacToeGameComponent implements OnInit, OnDestroy {
  gameId: number;
  private paramMap$: Subscription;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.paramMap$ = this.route.paramMap.subscribe(
      params => {
        this.gameId = +params.get('id');
      }
    );
  }

  ngOnDestroy() {
    this.paramMap$.unsubscribe();
  }
}
