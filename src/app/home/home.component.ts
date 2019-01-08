import { Component, OnInit } from '@angular/core';
import {SessionStorageService} from '../session-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // TODO emmit login signal from login component to change username
  username = 'User';
  isLoggedIn = false;

  constructor(private storage: SessionStorageService) { }

  ngOnInit() {
    // TODO emit event from login
    if (this.storage.getToken()) {
      this.username = this.storage.getUsername();
      this.isLoggedIn = true;
    }
  }
}
