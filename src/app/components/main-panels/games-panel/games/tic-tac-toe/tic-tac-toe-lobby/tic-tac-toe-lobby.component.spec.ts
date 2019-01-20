import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeLobbyComponent } from './tic-tac-toe-lobby.component';

describe('TicTacToeLobbyComponent', () => {
  let component: TicTacToeLobbyComponent;
  let fixture: ComponentFixture<TicTacToeLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicTacToeLobbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicTacToeLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
