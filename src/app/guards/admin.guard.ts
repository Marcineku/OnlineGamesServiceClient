import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {

  constructor(private auth: AuthService,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.auth.isAdminLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/news']).then(
        () => {
          console.log(`You must be logged in as an admin in order to enter here, re-navigating to '/news'`);
        },
        reason => {
          console.error(`Re-navigating to '/news' failed`, reason);
        }
      );
      return false;
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return !!this.canActivate(route, state);
  }
}
