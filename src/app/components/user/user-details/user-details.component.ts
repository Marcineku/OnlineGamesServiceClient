import {Component} from '@angular/core';
import {SessionStorageService} from '../../../services/session-storage.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {

  constructor(private sessionStorage: SessionStorageService) {
  }

  getToken() {
    return this.sessionStorage.getToken();
  }

  getTokenType() {
    return this.sessionStorage.getTokenType();
  }

  getUsername() {
    return this.sessionStorage.getUsername();
  }

  getAuthorities() {
    return this.sessionStorage.getAuthorities();
  }
}
