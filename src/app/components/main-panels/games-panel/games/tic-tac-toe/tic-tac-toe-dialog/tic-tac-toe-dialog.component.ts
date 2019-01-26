import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-tic-tac-toe-dialog',
  templateUrl: './tic-tac-toe-dialog.component.html',
  styleUrls: ['./tic-tac-toe-dialog.component.css']
})
export class TicTacToeDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public message: string) {
  }
}
