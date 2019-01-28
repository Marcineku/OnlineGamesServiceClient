import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './components/user/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatNativeDateModule} from '@angular/material';
import {MaterialModule} from '../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserComponent} from './components/user/user.component';
import {RegistrationComponent} from './components/user/registration/registration.component';
import {UserDetailsComponent} from './components/user/user-details/user-details.component';
import {apiInterceptorProvider} from './http-interceptors/api-interceptor';
import {AdminPanelComponent} from './components/main-panels/admin-panel/admin-panel.component';
import {TicTacToeComponent} from './components/main-panels/games-panel/games/tic-tac-toe/tic-tac-toe.component';
import {GamesPanelComponent} from './components/main-panels/games-panel/games-panel.component';
import {NewsPanelComponent} from './components/main-panels/news-panel/news-panel.component';
import {AppRoutingModule} from './routing/app-routing.module';
import {ChatComponent} from './components/main-panels/games-panel/chat/chat.component';
import {GamesPanelRoutingModule} from './routing/games-panel-routing.module';
import {GamesListComponent} from './components/main-panels/games-panel/games-list/games-list.component';
import {TicTacToeGameComponent} from './components/main-panels/games-panel/games/tic-tac-toe/tic-tac-toe-game/tic-tac-toe-game.component';
import {TicTacToeLobbyComponent} from './components/main-panels/games-panel/games/tic-tac-toe/tic-tac-toe-lobby/tic-tac-toe-lobby.component';
import {TicTacToeDialogComponent} from './components/main-panels/games-panel/games/tic-tac-toe/tic-tac-toe-dialog/tic-tac-toe-dialog.component';
import {SummaryPanelComponent} from './components/main-panels/summary-panel/summary-panel.component';
import {SummaryPanelRoutingModule} from './routing/summary-panel-routing.module';
import {GamesHistoryComponent} from './components/main-panels/summary-panel/games-history/games-history.component';
import {GameMovesComponent} from './components/main-panels/summary-panel/game-moves/game-moves.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RegistrationComponent,
    UserDetailsComponent,
    ChatComponent,
    AdminPanelComponent,
    TicTacToeComponent,
    GamesPanelComponent,
    NewsPanelComponent,
    GamesListComponent,
    TicTacToeGameComponent,
    TicTacToeLobbyComponent,
    TicTacToeDialogComponent,
    SummaryPanelComponent,
    GamesHistoryComponent,
    GameMovesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    GamesPanelRoutingModule,
    SummaryPanelRoutingModule,
    AppRoutingModule
  ],
  providers: [
    apiInterceptorProvider
  ],
  bootstrap: [AppComponent],
  entryComponents: [TicTacToeGameComponent, TicTacToeDialogComponent]
})
export class AppModule {
}
