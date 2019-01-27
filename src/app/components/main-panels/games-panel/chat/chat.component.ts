import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatMessage, StompService} from '../../../../services/stomp.service';
import {Subject, Subscription} from 'rxjs';
import {SessionStorageService} from '../../../../services/session-storage.service';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {GamesService, TicTacToeGameInfo} from '../../../../services/games.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  virtualScrollViewport: CdkVirtualScrollViewport;
  @Input() gameId: number;
  message = '';
  username: string;
  gameInfo: TicTacToeGameInfo;
  private messagesList: ChatMessage[] = [];
  private messages = new Subject<ChatMessage[]>();
  messages$ = this.messages.asObservable();
  private chat: Subscription;
  private updatedGames: Subscription;

  constructor(private stomp: StompService,
              private sessionStorage: SessionStorageService,
              private gamesService: GamesService) {
  }

  ngOnInit() {
    this.chat = this.stomp.watchChat(this.gameId).subscribe(
      res => {
        this.addMessage(res);
      }
    );

    this.gamesService.getGameInfo(this.gameId).subscribe(
      res => {
        this.gameInfo = res;
      }
    );

    this.updatedGames = this.stomp.watchUpdatedGames().subscribe(
      res => {
        if (res.gameId === this.gameId) {
          if (this.gameInfo.secondPlayer !== res.secondPlayer) {
            const message = new ChatMessage();
            message.username = 'Info';
            message.date = new Date();

            if (res.secondPlayer) {
              message.message = `${res.secondPlayer} has joined`;
            } else {
              message.message = `${this.gameInfo.secondPlayer} has left`;
            }

            this.addMessage(message);
          }

          this.gameInfo = res;
        }
      }
    );

    this.username = this.sessionStorage.getUsername();
  }

  ngOnDestroy() {
    this.chat.unsubscribe();
    this.updatedGames.unsubscribe();
  }

  sendMessage() {
    if (this.message.length > 0) {
      this.stomp.sendChatMessage(this.message);
      this.message = '';
    }
  }

  private addMessage(chatMessage: ChatMessage) {
    this.messagesList.push(chatMessage);
    this.messages.next(this.messagesList);
    this.virtualScrollViewport.scrollTo({bottom: 0});
  }
}
