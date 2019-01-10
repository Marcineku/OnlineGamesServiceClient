import { Component, OnInit } from '@angular/core';
import {SessionStorageService} from '../../services/session-storage.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  constructor(private sessionStorageService: SessionStorageService) { }

  ngOnInit() { }

  getToken() {
    return this.sessionStorageService.getToken();
  }

  getTokenType() {
    return this.sessionStorageService.getTokenType();
  }

  getUsername() {
    return this.sessionStorageService.getUsername();
  }

  getAuthorities() {
    return this.sessionStorageService.getAuthorities();
  }
}
