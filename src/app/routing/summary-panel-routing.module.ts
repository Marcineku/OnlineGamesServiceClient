import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SummaryPanelComponent} from '../components/main-panels/summary-panel/summary-panel.component';
import {AuthGuard} from '../guards/auth.guard';
import {GamesHistoryComponent} from '../components/main-panels/summary-panel/games-history/games-history.component';
import {GameMovesComponent} from '../components/main-panels/summary-panel/game-moves/game-moves.component';

const routes: Routes = [
  {
    path: 'summary',
    component: SummaryPanelComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: GamesHistoryComponent
      },
      {
        path: ':id',
        component: GameMovesComponent
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
export class SummaryPanelRoutingModule {
}
