import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatMessage, StompService} from '../../../../services/stomp.service';
import {Subject, Subscription} from 'rxjs';
import {SessionStorageService} from '../../../../services/session-storage.service';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

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
  private messagesList: ChatMessage[] = [];
  private messages = new Subject<ChatMessage[]>();
  messages$ = this.messages.asObservable();
  private chat: Subscription;

  constructor(private stomp: StompService,
              private sessionStorage: SessionStorageService) {
  }

  ngOnInit() {
    this.chat = this.stomp.watchChat(this.gameId).subscribe(
      res => {
        this.messagesList.push(res);
        this.messages.next(this.messagesList);
        this.virtualScrollViewport.scrollTo({bottom: 0});
      }
    );

    this.username = this.sessionStorage.getUsername();
  }

  ngOnDestroy() {
    this.chat.unsubscribe();
  }

  sendMessage() {
    if (this.message.length > 0) {
      this.stomp.sendChatMessage(this.message);
      this.message = '';
    }
  }
}
