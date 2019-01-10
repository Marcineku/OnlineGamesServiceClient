import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { NewsComponent } from './components/news/news.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material';
import { MaterialModule } from '../material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GamesComponent } from './components/games/games.component';
import { UserComponent } from './components/user/user.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { ChatComponent } from './components/chat/chat.component';
import { apiInterceptorProvider } from './http-interceptors/api-interceptor';
import { tokenInterceptorProvider } from './http-interceptors/token-interceptor';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewsComponent,
    LoginComponent,
    GamesComponent,
    UserComponent,
    RegistrationComponent,
    UserDetailsComponent,
    ChatComponent,
    AdminPanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  providers: [
    apiInterceptorProvider,
    tokenInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
