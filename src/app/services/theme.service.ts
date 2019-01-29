import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {SessionStorageService} from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeChanged = new Subject<string>();
  themeChanged$ = this.themeChanged.asObservable();

  constructor(private sessionStorage: SessionStorageService) {
  }

  changeTheme() {
    const theme = this.sessionStorage.getTheme();
    if (theme === 'dark') {
      this.sessionStorage.setTheme('light');
      this.themeChanged.next('light');
    } else {
      this.sessionStorage.setTheme('dark');
      this.themeChanged.next('dark');
    }
  }
}
