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

  changeTheme(theme: string) {
    this.sessionStorage.setTheme(theme);
    this.themeChanged.next(theme);
  }
}
