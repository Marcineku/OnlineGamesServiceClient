import {Injectable} from '@angular/core';
import {SessionStorageService} from './session-storage.service';
import {InjectableRxStompConfig, RxStompService} from '@stomp/ng2-stompjs';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {RxStompState} from '@stomp/rx-stomp';
import {IFrame} from '@stomp/stompjs';
import {TicTacToeGameInfo, TicTacToeGameState} from './games.service';

export class ChatMessage {
  username: string;
  message: string;
  date: Date;
}

const rxStompConfig: InjectableRxStompConfig = {
  brokerURL: 'ws://localhost:8080/socket',
  connectHeaders: {},
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 2000,
  debug: (msg: string): void => {
    console.log(msg);
  }
};

@Injectable({
  providedIn: 'root'
})
export class StompService {
  private rxStompService = new RxStompService();
  private gameId: number;

  constructor(private sessionStorage: SessionStorageService) {
  }

  connect() {
    const tokenType = this.sessionStorage.getTokenType();
    const token = this.sessionStorage.getToken();
    rxStompConfig.connectHeaders = {
      Authorization: tokenType + ' ' + token
    };
    this.rxStompService.configure(rxStompConfig);
    this.rxStompService.activate();
  }

  getConnectionErrors(): Observable<IFrame> {
    return this.rxStompService.stompErrors$.asObservable();
  }

  getConnectionState(): Observable<string> {
    return this.rxStompService.connectionState$.asObservable().pipe(
      map(state => RxStompState[state])
    );
  }

  disconnect() {
    this.rxStompService.deactivate();
  }

  watchChat(gameId: number): Observable<ChatMessage> {
    this.gameId = gameId;
    return this.rxStompService.watch(`/chat/${gameId}`).pipe(
      map(message => JSON.parse(message.body))
    );
  }

  watchMoves(gameId: number): Observable<TicTacToeGameState> {
    this.gameId = gameId;
    return this.rxStompService.watch(`/move/${gameId}`).pipe(
      map(message => JSON.parse(message.body))
    );
  }

  watchCreatedGames(): Observable<TicTacToeGameInfo> {
    return this.rxStompService.watch(`/tictactoe/add`).pipe(
      map(message => JSON.parse(message.body))
    );
  }

  watchUpdatedGames(): Observable<TicTacToeGameInfo> {
    return this.rxStompService.watch(`/tictactoe/update`).pipe(
      map(message => JSON.parse(message.body))
    );
  }

  watchDeletedGames(): Observable<number> {
    return this.rxStompService.watch(`/tictactoe/delete`).pipe(
      map(message => parseInt(message.body, 10))
    );
  }

  sendChatMessage(message: string) {
    this.rxStompService.publish({destination: `/app/send/message/${this.gameId}`, body: message});
  }

  sendMove(move: number) {
    this.rxStompService.publish({destination: `/app/send/move/${this.gameId}`, body: move.toString(10)});
  }
}
