import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GamesPanelComponent} from '../components/main-panels/games-panel/games-panel.component';
import {TicTacToeComponent} from '../components/main-panels/games-panel/games/tic-tac-toe/tic-tac-toe.component';
import {GamesListComponent} from '../components/main-panels/games-panel/games-list/games-list.component';
import {AuthGuard} from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'games',
    component: GamesPanelComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: GamesListComponent
      },
      {
        path: 'tic-tac-toe',
        component: TicTacToeComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class GamesPanelRoutingModule {
}
