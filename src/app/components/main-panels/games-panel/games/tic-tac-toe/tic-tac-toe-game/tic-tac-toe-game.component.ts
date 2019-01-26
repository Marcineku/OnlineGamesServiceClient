import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {GamesService, TicTacToeGameDTOResponse} from '../../../../../../services/games.service';
import {StompService} from '../../../../../../services/stomp.service';

@Component({
  selector: 'app-tic-tac-toe-game',
  templateUrl: './tic-tac-toe-game.component.html',
  styleUrls: ['./tic-tac-toe-game.component.css']
})
export class TicTacToeGameComponent implements OnInit, OnDestroy, AfterViewInit {
  gameId: number;
  isOwner: boolean;
  @ViewChild('game') svg: ElementRef;
  board: Board;
  private paramMap$: Subscription;
  gameState: TicTacToeGameDTOResponse;
  private updatedGames: Subscription;

  constructor(private route: ActivatedRoute,
              private gamesService: GamesService,
              private stomp: StompService) {
  }

  ngOnInit() {
    this.paramMap$ = this.route.paramMap.subscribe(
      params => {
        this.gameId = +params.get('id');
        this.isOwner = (params.get('owner') === 'true');
      }
    );

    if (!this.isOwner) {
      this.gamesService.joinGame(this.gameId).subscribe(
        res => {
          this.gameState = res;
        }
      );
    }

    this.updatedGames = this.stomp.watchUpdatedGames().subscribe(
      res => {
        if (res.gameId === this.gameId) {
          this.gameState = res;
        }
      }
    );

    const width = this.svg.nativeElement.getBoundingClientRect().width;
    const height = this.svg.nativeElement.getBoundingClientRect().height;
    this.board = new Board(width, height);
  }

  ngAfterViewInit() {
    const width = this.svg.nativeElement.getBoundingClientRect().width;
    const height = this.svg.nativeElement.getBoundingClientRect().height;
    this.board = new Board(width, height);
  }

  ngOnDestroy() {
    this.paramMap$.unsubscribe();
    this.updatedGames.unsubscribe();
  }

  @HostListener('window:resize')
  onResize() {
    const width = this.svg.nativeElement.getBoundingClientRect().width;
    const height = this.svg.nativeElement.getBoundingClientRect().height;
    this.board.reDraw(width, height);
  }

  onFieldClick(fieldNo: number) {
    const field = this.board.getField(fieldNo);

    const width = this.svg.nativeElement.getBoundingClientRect().width;
    const height = this.svg.nativeElement.getBoundingClientRect().height;
    this.board.drawFields(width, height);
  }

  onGameStart() {
    this.gamesService.startGame(this.gameId).subscribe(
      res => {
        this.gameState = res;
      },
      err => {

      }
    );
  }
}

class Board {
  fields: Field[] = [];
  lines: Line[] = [];

  constructor(width: number, height: number) {
    for (let i = 0; i < 4; ++i) {
      this.lines.push(new Line(0, 0, 0, 0));
    }
    for (let i = 0; i < 9; ++i) {
      this.fields.push(new Field(i, 0, 0, 0, 0));
    }

    this.reDraw(width, height);
  }

  reDraw(width: number, height: number) {
    this.drawLines(width, height);
    this.drawFields(width, height);
  }

  drawLines(width: number, height: number) {
    let x1, y1, x2, y2;

    // Vertical lines
    x1 = width / 3;
    y1 = 0;
    x2 = x1;
    y2 = height;
    this.lines[0].p1.x = x1;
    this.lines[0].p1.y = y1;
    this.lines[0].p2.x = x2;
    this.lines[0].p2.y = y2;
    x1 = 2 * width / 3;
    x2 = x1;
    this.lines[1].p1.x = x1;
    this.lines[1].p1.y = y1;
    this.lines[1].p2.x = x2;
    this.lines[1].p2.y = y2;
    // Horizontal Lines
    x1 = 0;
    y1 = height / 3;
    x2 = width;
    y2 = y1;
    this.lines[2].p1.x = x1;
    this.lines[2].p1.y = y1;
    this.lines[2].p2.x = x2;
    this.lines[2].p2.y = y2;
    y1 = 2 * height / 3;
    y2 = y1;
    this.lines[3].p1.x = x1;
    this.lines[3].p1.y = y1;
    this.lines[3].p2.x = x2;
    this.lines[3].p2.y = y2;
  }

  drawFields(width: number, height: number) {
    const rectWidth = width / 3;
    const rectHeight = height / 3;

    this.fields[1].x = rectWidth;
    this.fields[4].x = rectWidth;
    this.fields[7].x = rectWidth;
    this.fields[2].x = 2 * rectWidth;
    this.fields[5].x = 2 * rectWidth;
    this.fields[8].x = 2 * rectWidth;

    this.fields[3].y = rectHeight;
    this.fields[4].y = rectHeight;
    this.fields[5].y = rectHeight;
    this.fields[6].y = 2 * rectHeight;
    this.fields[7].y = 2 * rectHeight;
    this.fields[8].y = 2 * rectHeight;

    for (const field of this.fields) {
      field.width = rectWidth;
      field.height = rectHeight;
    }
  }

  getField(fieldNo: number) {
    return this.fields[fieldNo];
  }
}

class Field {
  no: number;

  x: number;
  y: number;

  width: number;
  height: number;

  fieldState: FieldState;

  constructor(no: number, x: number, y: number, width: number, height: number) {
    this.no = no;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.fieldState = FieldState.Empty;
  }
}

class Line {
  p1: Point;
  p2: Point;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
  }
}

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

enum FieldState {
  Circle = 'circle',
  Cross = 'cross',
  Empty = 'empty'
}
