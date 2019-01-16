import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewsPanelComponent} from '../components/main-panels/news-panel/news-panel.component';
import {AdminPanelComponent} from '../components/main-panels/admin-panel/admin-panel.component';
import {AdminGuard} from '../guards/admin.guard';

const routes: Routes = [
  {
    path: 'news',
    component: NewsPanelComponent,
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AdminGuard]
  },
  {
    path: '',
    redirectTo: '/news',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/news'
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
