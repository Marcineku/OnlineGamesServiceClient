import {Component, OnInit} from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import * as $ from 'jquery';
import {SessionStorageService} from '../../services/session-storage.service';
import {Frame} from 'stompjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private serverUrl = 'http://localhost:8080/socket';
  private stompClient;

  constructor(private sessionStorageSevice: SessionStorageService) { }

  ngOnInit() { }

  onConnect() {
    this.initializeWebSocketConnection();
  }

  sendMessage(message) {
    this.stompClient.send('/app/send/message' , {}, message);
    $('#input').val('');
  }

  private initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    const tokenType = this.sessionStorageSevice.getTokenType();
    const token = this.sessionStorageSevice.getToken();
    this.stompClient.connect({ Authorization: tokenType + ' ' + token }, function(frame: Frame) {
      console.log(frame);

      that.stompClient.subscribe('/chat', (message) => {
        if (message.body) {
          $('.chat').append(`<div class='message'>${message.body}</div>`);
          console.log(message.body);
        }
      });
    });
  }
}
