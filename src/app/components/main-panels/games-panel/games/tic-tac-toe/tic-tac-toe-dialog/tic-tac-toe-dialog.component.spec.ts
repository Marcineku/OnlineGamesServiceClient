import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeDialogComponent } from './tic-tac-toe-dialog.component';

describe('TicTacToeDialogComponent', () => {
  let component: TicTacToeDialogComponent;
  let fixture: ComponentFixture<TicTacToeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicTacToeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicTacToeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
